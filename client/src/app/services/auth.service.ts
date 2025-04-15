import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

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
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    console.log('Saved tokens:', { accessToken, refreshToken, role, username }); // Debug
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        map((response: any) => {
          if (response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
            console.log('Access token refreshed:', response.accessToken);
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('theme');
    localStorage.removeItem('email');
    localStorage.removeItem('token');

    console.log('Logged out, tokens cleared');
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
}
