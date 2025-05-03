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

  private apiUrl = 'http://localhost:8000/api/users/current';
  private updateApiUrl = 'http://localhost:8000/api/users/postUserInformation';

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

    // Gọi endpoint GET /api/users/current
    this.http
      .get(this.apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          // Sửa lại: Truy cập trực tiếp response thay vì response.user
          this.user = {
            username: response.username || response.email || 'Guest',
            email: response.email || '',
            role: response.role || 'user',
          };
          this.profile = {
            firstName: response.firstname || '', // Sửa firstName thành firstname (theo backend)
            lastName: response.lastname || '',   // Sửa lastName thành lastname
            email: response.email || '',
            phone: response.phonenumber || '',  // Sửa phone thành phonenumber
            address: response.address || '',
            avatar: response.avatar || this.profile.avatar,
          };
          if (this.isBrowser) {
            localStorage.setItem('username', this.user.username || 'Guest');
            localStorage.setItem('email', this.user.email || '');
            localStorage.setItem('role', this.user.role || 'user');
          }
          // console.log('User profile:', this.user);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
          this.errorMessage = 'Không thể lấy thông tin người dùng. Vui lòng thử lại.';
          this.isLoading = false;
          this.router.navigate(['/auth']);
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
    if (!this.profile.firstName || !this.profile.lastName) {
      this.errorMessage = 'Vui lòng điền đầy đủ First Name và Last Name.';
      this.successMessage = null;
      return;
    }

    // Lấy userId từ token
    const token = this.authService.getAccessToken();
    if (!token) {
      this.errorMessage = 'Không tìm thấy token. Vui lòng đăng nhập lại.';
      this.router.navigate(['/auth']);
      return;
    }

    const decodedToken = this.authService.decodeToken(token);
    const userId = decodedToken?.user?.id || null;
    if (!userId) {
      this.errorMessage = 'Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.';
      return;
    }

    // Chuẩn bị dữ liệu gửi lên server
    const userInformation = {
      firstname: this.profile.firstName,
      lastname: this.profile.lastName,
      phonenumber: this.profile.phone || null,
      address: this.profile.address || null,
      avatar: this.profile.avatar || null,
      birthday: null,
    };

    const payload = {
      userId: userId,
      userInformation: userInformation,
    };

    // Gửi yêu cầu POST đến /api/users/userInformation
    this.isLoading = true;
    this.http
      .post(this.updateApiUrl, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          this.successMessage = 'Thông tin đã được lưu thành công!';
          this.errorMessage = null;
          console.log('Lưu thông tin thành công:', response);

          // Sau khi lưu thành công, gọi lại fetchUserProfile để cập nhật dữ liệu
          this.fetchUserProfile();
        },
        error: (error) => {
          // Hiển thị thông báo lỗi chi tiết
          const errorMsg = error.status === 404
            ? 'Không tìm thấy endpoint. Vui lòng kiểm tra backend.'
            : error.error?.message || 'Lưu thông tin thất bại. Vui lòng thử lại.';
          this.errorMessage = errorMsg;
          this.successMessage = null;
          console.error('Lỗi khi lưu thông tin:', error);
          this.isLoading = false;
        },
      });
  }
}
