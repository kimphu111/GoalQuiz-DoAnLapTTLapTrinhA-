import {Component} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isSignIn: boolean = true;

  username: string = '';
  password: string = '';
  email: string = '';
  message: string = '';
  rememberMe: boolean = false;
  isSuccess: boolean | null = null;

  showSpinner: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  toggleForm(event: MouseEvent) {
    this.isSignIn = !this.isSignIn;
    this.message = '';
    this.isSuccess = null;
    this.showSpinner = false;
    event.preventDefault();
  }

  /** Login */
  onLogin(event: Event, form: NgForm) {
    event.preventDefault();
    this.showSpinner = true;
    this.message = '';
    this.isSuccess = null;

    if (form.invalid) {
      this.message = 'Please fill in all fields correctly.';
      this.isSuccess = false;
      this.showSpinner = false;
      return;
    }

    const loginData = {
      email: this.email.trim(),
      password: this.password.trim(),
    };

    this.http.post('http://localhost:8000/api/users/login', loginData).subscribe({
      next: (response: any) => {
        try {
          if (!response.accessToken) throw new Error('Invalid response structure');

          this.message = response.message || 'Login successful!';
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken || '');
          const role = response.role || response.user?.role || 'user';
          localStorage.setItem('role', role);

          const helper = new JwtHelperService();
          const decoded: any = helper.decodeToken(response.accessToken);
          if (decoded && decoded.user) {
            localStorage.setItem('userId', decoded.user.id);
            localStorage.setItem('username', decoded.user.username);
            localStorage.setItem('email', decoded.user.email);
          }

          this.isSuccess = true;
          setTimeout(() => {
            this.showSpinner = false;
            this.router.navigate(['/home']);
          }, 1200);
        } catch (error) {
          this.message = 'Error processing login response.';
          this.isSuccess = false;
          this.showSpinner = false;
        }
      },
      error: (error) => {
        this.message = error.error?.message || 'Login failed.';
        this.isSuccess = false;
        this.showSpinner = false;
      }
    });
  }

  /** Register */
  onRegister(event: Event, registerForm: NgForm) {
    event.preventDefault();
    this.showSpinner = true;
    this.message = '';
    this.isSuccess = null;

    if (registerForm.invalid) {
      this.message = 'Please fill in all fields correctly.';
      this.isSuccess = false;
      this.showSpinner = false;
      return;
    }

    // ✅ Full name validation
    const usernameRegex = /^(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!usernameRegex.test(this.username.trim())) {
      this.message = 'Username must be at least 6 characters and contain at least 1 number.';
      this.isSuccess = false;
      this.showSpinner = false;
      return;
    }

    // ✅ Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(this.email.trim())) {
      this.message = 'Invalid email format.';
      this.isSuccess = false;
      this.showSpinner = false;
      return;
    }

    // ✅ Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/;
    if (!passwordRegex.test(this.password)) {
      this.message = 'Password must be at least 7 chars, contain 1 number & 1 special char.';
      this.isSuccess = false;
      this.showSpinner = false;
      return;
    }

    const registerData = {
      username: this.username.trim(),
      password: this.password.trim(),
      email: this.email.trim(),
    };

    this.http.post('http://localhost:8000/api/users/register', registerData).subscribe({
      next: (response: any) => {
        this.message = response.message || 'Register successful!';
        this.isSuccess = true;
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', this.username);

        setTimeout(() => {
          this.showSpinner = false;
          this.router.navigate(['/auth']);
          window.location.reload();
        }, 1200);
      },
      error: (err) => {
        this.message = err.error?.message || 'Register failed.';
        this.isSuccess = false;
        this.showSpinner = false;
      }
    });
  }
}
