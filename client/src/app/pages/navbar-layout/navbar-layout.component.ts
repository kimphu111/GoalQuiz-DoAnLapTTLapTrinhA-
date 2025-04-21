import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {isPlatformBrowser, NgClass} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-layout',
  templateUrl: './navbar-layout.component.html',
  styleUrls: ['./navbar-layout.component.scss'],
  imports: [NgClass, RouterLink, RouterOutlet],
  standalone: true
})
export class navbarLayoutComponent {
  username: string = '';
  email: string = '';
  isDarkMode: boolean = false;
  isSidebarVisible: boolean = true;
  isLoading: boolean = false;
  isBrowser: boolean;



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

    if (this.isBrowser) {
      this.username = localStorage.getItem('username') || 'Guest';
      this.email = localStorage.getItem('email') || 'Guest';
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/home']);
        return;
      }
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private fetchUserProfile() {
    this.http.get('http://localhost:8000/api/profile', {
      headers: { Authorization: `Bearer ${this.authService.getAccessToken()}` }
    }).subscribe({
      next: (response: any) => {
        this.username = response.user.username || response.user.email || 'Guest';
        localStorage.setItem('username', this.username);
        console.log('Username from API:', this.username);
      },
      error: (error: any) => {
        console.error('Lỗi lấy thông tin người dùng:', error);
        this.username = 'Guest';
      }
    });
  }

  private loadTheme() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      console.log('savedTheme:', savedTheme);
      this.isDarkMode = savedTheme !== 'light';
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
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
    // Logic đăng xuất
    this.router.navigate(['/login']);
  }
}
