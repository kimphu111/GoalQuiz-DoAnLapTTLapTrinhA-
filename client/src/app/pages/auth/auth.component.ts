import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgClass, FormsModule,CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'

})
export class AuthComponent {
  isSignIn: boolean = true;
  isSignUp: boolean = false;

  username: string = '';
  password: string = '';
  email: string = '';
  message: string = '';
  rememberMe: boolean = false;
  isSuccess: boolean | null = null; // null: không trạng thái, true: thành công, false: thất bại

  //spinner
  showSpinner: boolean  = false;

  constructor(private http: HttpClient, private router: Router) {
  }

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
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password,
      username: this.username,
    };

    this.http
      .post('http://localhost:8000/api/auth/login', loginData)
      .subscribe({
        next: (response: any) => {
          this.message = response.message || 'Login successful!';
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('username', response.user.username);
          localStorage.setItem('email', response.user.email);
          localStorage.setItem('role', response.role);
          localStorage.setItem('token', response.token);
          this.isSuccess = true;

          setTimeout(() => {
            this.showSpinner = false;
            this.router.navigate(['/home']);
          }, 1500);
        },
        error: (error) => {
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

    this.showSpinner = true; // Hiển thị spinner khi bắt đầu đăng ký
    this.message = '';
    this.isSuccess = null;

    if (registerForm.invalid){
      this.message =' Please fill in all fields.';
      this.isSuccess = false;
      return;
    }

    const registerData = {
      username: this.username,
      password: this.password,
      email: this.email,
    }

    this.http
      .post('http://localhost:8000/api/auth/register', registerData)
      .subscribe({
        next: (respone: any) => {
          this.message = respone.message || 'Register successful!';
          this.isSuccess = true;
          localStorage.setItem('token', respone.token);
          localStorage.setItem('role', respone.role);
          localStorage.setItem('username', this.username);
          console.log('Register successful:', respone);
          setTimeout(() => {
            this.showSpinner = false
            this.router.navigate(['/auth']);
            window.location.reload();
          },1200);
        },
        error: (err) => {
          this.message = err.error?.message || 'Register failed.';
          this.isSuccess = false;
          setTimeout(() =>{
            this.showSpinner = false;
            window.location.reload();
          },1200);
        }
      })

  }
}
