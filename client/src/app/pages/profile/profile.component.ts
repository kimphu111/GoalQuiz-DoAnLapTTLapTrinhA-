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
  showPopup: boolean = true; // Biến để điều khiển popup

  profile = {
    avatar: 'D:\\DoAnLapTrinhA\\GoalQuizClient\\client\\src\\assets\\admin.jpg', // Thay URL dài bằng placeholder
    firstName: '',
    lastName: '',
    birthday: '',
    email: '',
    phone: '',
    address: '',
  };

  private selectedFile: File | null = null;
  private apiUrl = 'http://localhost:8000/api/users/current';
  private updateApiUrl = 'http://localhost:8000/api/users/userInformation';

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

  isFullUrl(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://') || false;
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
            avatar: response.avatar || this.profile.avatar,
            firstName: response.firstname || '',
            lastName: response.lastname || '',
            birthday: response.birthday || '',
            email: response.email || '',
            phone: response.phonenumber || '',
            address: response.address || '',
          };
          if (this.isBrowser) {
            localStorage.setItem('username', this.user.username || 'Guest');
            localStorage.setItem('email', this.user.email || '');
            localStorage.setItem('role', this.user.role || 'user');
          }
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

  openPopup() {
    this.showPopup = true;
    const nav = document.querySelector('.mobile-sidebar');
    if (nav) (nav as HTMLElement).style.display = 'none';
  }

  closePopup() {
    this.showPopup = false;
    const nav = document.querySelector('.mobile-sidebar');
    if (nav) (nav as HTMLElement).style.display = 'flex'; // hoặc 'block'
  }





  onUpload() {
    if (!this.isBrowser) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
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
    this.selectedFile = null;
  }

  onSave() {
    console.log('onSave() được gọi');
    if (!this.isBrowser) {
      console.log('Không phải môi trường browser');
      return;
    }

    if (!this.profile.firstName || !this.profile.lastName) {
      console.log('Thiếu firstName hoặc lastName');
      this.errorMessage = 'Vui lòng điền đầy đủ First Name và Last Name.';
      this.successMessage = null;
      return;
    }

    const token = this.authService.getAccessToken();
    if (!token) {
      console.log('Không có token');
      this.errorMessage = 'Không tìm thấy token. Vui lòng đăng nhập lại.';
      this.router.navigate(['/auth']);
      return;
    }

    const userInformation = {
      firstname: this.profile.firstName,
      lastname: this.profile.lastName,
      birthday: this.profile.birthday || null,
      phonenumber: this.profile.phone || null,
      address: this.profile.address || null,
    };

    const formData = new FormData();
    formData.append('userInformation', JSON.stringify(userInformation));
    if (this.selectedFile) {
      console.log('File avatar:', this.selectedFile.name, this.selectedFile.size, this.selectedFile.type);
      formData.append('avatar', this.selectedFile);
    } else {
      console.log('Không có file mới, gửi avatar cũ:', this.profile.avatar);
      formData.append('avatar', this.profile.avatar || '');
    }

    for (let pair of (formData as any).entries()) {
      console.log('FormData:', pair[0], pair[1]);
    }

    this.isLoading = true;
    console.log('Gửi request tới:', this.updateApiUrl);
    this.http
      .post(this.updateApiUrl, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          console.log('Response backend:', response);
          if (response.avatar) {
            this.profile.avatar = response.avatar;
            this.successMessage = 'Cập nhật thông tin và avatar thành công!';
          } else {
            this.successMessage = 'Cập nhật thông tin thành công, nhưng avatar không được lưu!';
          }
          this.errorMessage = null;
          this.selectedFile = null;
          this.fetchUserProfile();
        },
        error: (error) => {
          console.error('Lỗi:', error);
          this.errorMessage = error.error?.message || 'Cập nhật thất bại!';
          this.successMessage = null;
          this.isLoading = false;
        },
        complete: () => {
          console.log('Request hoàn tất');
          this.isLoading = false;
        },
      });
  }
}
