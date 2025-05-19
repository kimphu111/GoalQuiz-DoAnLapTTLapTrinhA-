import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
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
export class NavbarLayoutComponent {
  username: string = 'Guest';
  email: string = '';
  role: string | null = null;
  isDarkMode: boolean = false;
  isSidebarVisible: boolean = true;
  isLoading: boolean = false;
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadTheme();
  }

  ngOnInit() {
    this.isLoading = true;

    if (this.isBrowser) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        this.isLoading = false;
        return;
      }

      // Lấy username từ localStorage (giá trị tạm thời)
      this.username = localStorage.getItem('username') || 'Guest';
      this.email = localStorage.getItem('email') || '';
      this.role = localStorage.getItem('role');

      // Gọi API để lấy dữ liệu người dùng
      this.fetchUserProfile();
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
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
          // this.username = response.user.username || response.user.email || 'Guest';
          // this.email = response.user.email || '';

          // Nếu response.user tồn tại thì lấy, không thì fallback sang response
          // Tránh Cannot read properties undefined(reading 'username')
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
          console.log('Username from API:', this.username);
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

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onLogout() {
    this.authService.logout();
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
