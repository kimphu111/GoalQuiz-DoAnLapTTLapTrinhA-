import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID để kiểm tra môi trường
  ) {}
  // Hàm đăng nhập
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response: any) => {
        if (response.accessToken && response.refreshToken) {
          this.saveTokens(
            response.accessToken,
            response.refreshToken,
            response.role || 'user',
            response.user?.username || response.user?.email || email
          );
          // Chuyển hướng đến /home sau khi đăng nhập thành công
          if (isPlatformBrowser(this.platformId)) {
            this.router.navigate(['/home']);
          }
        }
        return response;
      }),
      catchError((error) => {
        console.error('Đăng nhập thất bại:', error);
        return throwError(() => error);
      })
    );
  }

  // Lưu token và username
  saveTokens(accessToken: string, refreshToken: string, role: string, username: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      console.log('Saved tokens:', { accessToken, refreshToken, role, username });
    }
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null; // Trả về null nếu chạy trên server
  }

  // Lấy refresh token
  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('refreshToken');
    }
    return null; // Trả về null nếu chạy trên server
  }

  // Lấy username
  getUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username');
    }
    return null; // Trả về null nếu chạy trên server
  }

  // Làm mới token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      map((response: any) => {
        if (response.accessToken) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', response.accessToken);
            console.log('Access token refreshed:', response.accessToken);
          }
        }
        return response;
      }),
      catchError((error) => {
        console.error('Error refreshing token:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // Đăng xuất
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('theme');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      console.log('Logged out, tokens cleared');
    }
    // Chuyển hướng đến /auth sau khi đăng xuất
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/auth']);
    }
  }

  // Kiểm tra trạng thái đăng nhập
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // Kiểm tra token còn hợp lệ không
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    const payload = this.parseJwt(token);
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate > new Date();
  }

  // Giải mã JWT
  private parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
