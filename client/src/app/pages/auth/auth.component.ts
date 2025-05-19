import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  isSignIn: boolean = true;
  isSignUp: boolean = false;

  username: string = '';
  password: string = '';
  email: string = '';
  message: string = '';
  rememberMe: boolean = false;
  isSuccess: boolean | null = null;

  showSpinner: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {}

  toggleForm($event: MouseEvent) {
    this.isSignIn = !this.isSignIn;
    this.message = '';
    this.isSuccess = false;
    this.showSpinner = false;
  }

  onLogin(event: Event, form: NgForm) {
    event.preventDefault();

    this.showSpinner = true;
    this.message = '';
    this.isSuccess = null;

    if (form.invalid) {
      this.message = 'Please fill in all fields.';
      this.isSuccess = false;
      this.showSpinner = false;
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.http
      .post('http://localhost:8000/api/users/login', loginData)
      .subscribe({
        next: (response: any) => {
          try {
            if (!response.accessToken) {
              throw new Error('Invalid response structure');
            }
            console.log('Login response:', response); // Debug API response

            this.message = response.message || 'Login successful!';
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken || '');
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('email', response.user.email);
            localStorage.setItem(
              'token',
              response.token || response.accessToken,
            );

            // Lưu role và user object
            const role = response.user?.role || response.role || 'user';
            localStorage.setItem('role', role);
            localStorage.setItem(
              'user',
              JSON.stringify({
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                role: role,
              }),
            );

            const helper = new JwtHelperService();
            const decoded: any = helper.decodeToken(response.accessToken);
            console.log('Decoded JWT:', decoded); // Debug JWT

            if (decoded && decoded.user) {
              localStorage.setItem('userId', decoded.user.id);
              localStorage.setItem('username', decoded.user.username);
              localStorage.setItem('email', decoded.user.email);
            }

            this.isSuccess = true;

            // Chuyển hướng theo role
            if (role === 'admin') {
              this.router.navigate(['/admin/quiz-history']);
            } else {
              this.router.navigate(['/home']);
            }

            setTimeout(() => {
              this.showSpinner = false;
            }, 1500);
          } catch (error) {
            console.error('Error processing response:', error);
            this.message = 'Error processing login response.';
            this.isSuccess = false;
            this.showSpinner = false;
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.message = error.error?.message || 'Login failed.';
          this.isSuccess = false;
          setTimeout(() => {
            this.showSpinner = false;
            window.location.reload();
          }, 1500);
        },
      });
  }

  onRegister(event: Event, registerForm: any) {
    event.preventDefault();

    this.showSpinner = true;
    this.message = '';
    this.isSuccess = null;

    if (registerForm.invalid) {
      this.message = 'Please fill in all fields.';
      this.isSuccess = false;
      this.showSpinner = false;
      return;
    }

    const registerData = {
      username: this.username,
      password: this.password,
      email: this.email,
    };

    this.http
      .post('http://localhost:8000/api/users/register', registerData)
      .subscribe({
        next: (response: any) => {
          this.message = response.message || 'Register successful!';
          this.isSuccess = true;
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role || 'user');
          localStorage.setItem('username', this.username);
          localStorage.setItem(
            'user',
            JSON.stringify({
              username: this.username,
              email: this.email,
              role: response.role || 'user',
            }),
          );
          console.log('Register successful:', response);
          setTimeout(() => {
            this.showSpinner = false;
            this.isSignIn = true;
            this.isSignUp = false;
          }, 1200);
        },
        error: (err) => {
          this.message = err.error?.message || 'Register failed.';
          this.isSuccess = false;
          setTimeout(() => {
            this.showSpinner = false;
          }, 1200);
        },
      });
  }
}
