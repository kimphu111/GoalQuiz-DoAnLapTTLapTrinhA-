import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';


//xoa di t test lan     2
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  // Hàm đăng nhập
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response: any) => {
        console.log('API response:', response); // Kiểm tra response
        if (response.accessToken && response.refreshToken) {
          this.saveTokens(
            response.accessToken,
            response.refreshToken,
            response.role || 'user',
            response.user?.username || response.user?.email || email
          );
          if (isPlatformBrowser(this.platformId)) {
            const role = response.role || 'user';
            console.log('Role:', role); // Kiểm tra role
            if (role === 'admin') {
              this.router.navigate(['/quiz-edit-admin']);
            } else {
              this.router.navigate(['/home']);
            }
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
    return null;
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  decodeToken(token: string): any {
    try {
      return this.parseJwt(token); // Sử dụng parseJwt thay vì JwtHelperService
    } catch (error) {
      console.error('Lỗi decode token:', error);
      return null;
    }
  }

  getUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username');
    }
    return null;
  }

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
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/auth']);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    const payload = this.parseJwt(token);
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate > new Date();
  }

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

  getRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role');
    }
    return null;
  }
}
