import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: { username?: string; email?: string; role?: string } = {};
  isLoading: boolean = false;
  isBrowser: boolean;
  isDarkMode: boolean = false;
  isSidebarVisible = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    avatar: 'https://via.placeholder.com/100',
  };

  private apiUrl = 'http://localhost:8000/api/users/userInformation';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.isLoading = true;
    if (this.isBrowser) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/auth']);
        this.isLoading = false;
        return;
      }
      this.user = {
        username: localStorage.getItem('username') || 'Guest',
        email: localStorage.getItem('email') || '',
        role: localStorage.getItem('role') || 'user',
      };
      this.profile.email = this.user.email || '';
      this.fetchUserProfile();
    } else {
      this.user = { username: 'Guest', email: '', role: '' };
      this.isLoading = false;
    }
  }

  private fetchUserProfile() {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.user = { username: 'Guest', email: '', role: '' };
      this.isLoading = false;
      this.router.navigate(['/auth']);
      return;
    }

    // Gọi endpoint GET /api/users/userInformation
    this.http
      .get(this.apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          this.user = {
            username: response.user?.username || response.user?.email || 'Guest',
            email: response.user?.email || '',
            role: response.user?.role || 'user',
          };
          this.profile = {
            firstName: response.user?.firstName || '',
            lastName: response.user?.lastName || '',
            email: response.user?.email || '',
            phone: response.user?.phone || '',
            address: response.user?.address || '',
            avatar: this.profile.avatar, // Giữ avatar hiện tại
          };
          if (this.isBrowser) {
            localStorage.setItem('username', this.user.username || 'Guest');
            localStorage.setItem('email', this.user.email || '');
            localStorage.setItem('role', this.user.role || 'user');
          }
          console.log('User profile:', this.user);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
          this.isLoading = false;
        },
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onUpload() {
    if (!this.isBrowser) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profile.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  onDelete() {
    this.profile.avatar = 'https://via.placeholder.com/100';
  }

  onSave() {
    if (!this.isBrowser) return;

    // Kiểm tra các trường bắt buộc
    if (!this.profile.firstName || !this.profile.lastName || !this.profile.email) {
      this.errorMessage = 'Vui lòng điền đầy đủ First Name, Last Name và Email.';
      this.successMessage = null;
      return;
    }

    // Chuẩn bị dữ liệu gửi lên server
    const userData = {
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      email: this.profile.email,
      phone: this.profile.phone || null,
      address: this.profile.address || null,
    };

    // Gửi yêu cầu POST đến /api/users/information
    const token = this.authService.getAccessToken();
    this.http
      .post(this.apiUrl, userData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          this.successMessage = 'Thông tin đã được lưu thành công!';
          this.errorMessage = null;
          console.log('Lưu thông tin thành công:', response);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Lưu thông tin thất bại. Vui lòng thử lại.';
          this.successMessage = null;
          console.error('Lỗi khi lưu thông tin:', error);
        },
      });
  }
}
