import { Component, HostListener, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './navbar-layout.component.html',
  styleUrls: ['./navbar-layout.component.scss'],
  imports: [NgClass, RouterLink, RouterOutlet, RouterLinkActive],
  standalone: true,
})
export class NavbarLayoutComponent implements AfterViewInit {
  username: string = 'Guest';
  email: string = '';
  role: string | null = null;
  isDarkMode: boolean = false;
  isSidebarVisible: boolean = true;
  isLoading: boolean = false;
  isBrowser: boolean;
  isMobileView: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadTheme();
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadTheme();
    this.checkScreenSize();
    if (this.isBrowser) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        this.isLoading = false;
        return;
      }
      this.username = localStorage.getItem('username') || 'Guest';
      this.email = localStorage.getItem('email') || '';
      this.role = localStorage.getItem('role');
      this.fetchUserProfile();
      setTimeout(() => this.checkScreenSize(), 100); // Đảm bảo chạy sau khi DOM sẵn sàng
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.checkScreenSize();
      setTimeout(() => this.checkScreenSize(), 0);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    console.log('Checking screen size...');
    console.log('isBrowser:', this.isBrowser);
    console.log('Window width:', this.isBrowser ? window.innerWidth : 'N/A');
    this.isMobileView = this.isBrowser ? window.innerWidth <= 768 : true;
    this.isSidebarVisible = !this.isMobileView;
    console.log('isMobileView:', this.isMobileView);
    console.log('isSidebarVisible:', this.isSidebarVisible);
  }

  private fetchUserProfile() {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.username = 'Guest';
      this.router.navigate(['/login']);
      this.isLoading = false;
      return;
    }
    this.http
      .get('http://localhost:8000/api/users/current', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          const user = response.user || response;
          this.username = user.username || user.email;
          this.email = user.email || '';
          this.role = user.role || localStorage.getItem('role');
          if (this.isBrowser) {
            localStorage.setItem('username', this.username);
            localStorage.setItem('email', this.email);
            if (user.role) {
              localStorage.setItem('role', user.role);
            }
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Lỗi lấy thông tin người dùng:', error);
          this.username = 'Guest';
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
      });
  }

  private loadTheme() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
        this.isDarkMode = false;
      } else {
        this.isDarkMode = savedTheme !== 'light';
      }
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isBrowser) {
      localStorage.setItem('theme', !this.isDarkMode ? 'light' : 'dark');
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isBrowser) {
      document.body.classList.toggle('light-mode', !this.isDarkMode);
    }
  }

  onLogout() {
    this.authService.logout();
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
