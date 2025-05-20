import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { JwtHelperService } from '@auth0/angular-jwt';

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
      this.showSpinner = false;
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password,
    };
    // console.log('[Login] Sending login request', loginData);
    // console.log('[Login] Form invalid:', form.invalid);
    // console.log('[Login] Form value:', form.value);

    this.http
      .post('http://localhost:8000/api/users/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log('Login response:', response); // Log response
          try {
            // Kiểm tra response có đầy đủ dữ liệu không
            if (!response.accessToken) {
              throw new Error('Invalid response structure');
            }

            this.message = response.message || 'Login successful!';
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken || '');
            localStorage.setItem('username', response.user?.username || '');
            localStorage.setItem('email', response.user?.email || '');
            // localStorage.setItem('role', response.role );
            // localStorage.setItem('token', response.token || response.accessToken);


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

            // const role = response.role || response.user?.role || 'user'; // Fallback là 'user'
            // localStorage.setItem('role', role);
            
            const helper = new JwtHelperService();
            const decoded: any = helper.decodeToken(response.accessToken);
            console.log('decode: ', decoded)

            let role = response.role || response.user?.role || 'user';
            if(decoded && decoded.user) {
              localStorage.setItem('userId', decoded.user.id);
              localStorage.setItem('username', decoded.user.username);
              localStorage.setItem('email', decoded.user.email);
              // Ưu tiên lấy role từ token nếu có
              role = decoded.user.role || decoded.role || role;
            }
            localStorage.setItem('role', role);
            console.log('Role saved:', role);
            this.isSuccess = true;

            setTimeout(() => {
              console.log('Setting showSpinner to false and navigating to /home');
              this.showSpinner = false;
              this.router.navigate(['/home']).then(success => {
                console.log('Navigation to /home:', success ? 'Successful' : 'Failed');
              });
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
            console.log('Reloading page due to error');
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
      .post('http://localhost:8000/api/users/register', registerData)
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
