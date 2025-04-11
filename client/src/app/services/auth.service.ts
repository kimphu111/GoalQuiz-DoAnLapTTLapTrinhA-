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

  saveTokens(accessToken: string, refreshToken: string, role: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', role);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
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
    console.log('Logged out, tokens cleared');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  isAuthenticated() {
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
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);

  }
}
