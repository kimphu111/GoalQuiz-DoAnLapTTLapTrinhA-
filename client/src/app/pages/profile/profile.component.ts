import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: { username?: string; email?: string; role?: string } = {};
  isLoading: boolean = false;
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // this.isLoading = true;
    // if (this.isBrowser) {
    //   if (!this.authService.isLoggedIn()) {
    //     this.router.navigate(['/auth']);
    //     this.isLoading = false;
    //     return;
    //   }
    //   this.fetchUserProfile();
    // } else {
    //   this.user = { username: 'Guest', email: '', role: '' };
    //   this.isLoading = false;
    // }
  }

  private fetchUserProfile() {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.user = { username: 'Guest', email: '', role: '' };
      this.isLoading = false;
      this.router.navigate(['/auth']);
      return;
    }

    this.http.get('http://localhost:3000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response: any) => {
        this.user = {
          username: response.user?.username || response.user?.email || 'Guest',
          email: response.user?.email || '',
          role: response.user?.role || 'user'
        };
        console.log('User profile:', this.user);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.user = {
          username: this.authService.getUsername() || 'Guest',
          email: '',
          role: ''
        };
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
