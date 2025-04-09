import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgClass,
    FormsModule
  ],
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
  isSuccess: boolean = false;

  constructor(private http: HttpClient, private router:Router) {}
  ngOnInit() {}

  toggleForm($event: MouseEvent) {
    this.isSignIn = !this.isSignIn;
    this.message = '';
    this.isSuccess = false;
  }

  onLogin(event: Event, form: NgForm) {
    event.preventDefault();

    if (form.invalid) {
      this.message = 'Please fill in all fields.';
      this.isSuccess = false;
      return;
    }

    const loginData = {
      username: this.username,
      password: this.password,
    };

    this.http
      .post('http://localhost:3000/api/auth/login', loginData)
      .subscribe({
        next: (response: any) => {
          this.message = response.message || 'Login successful!';
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          console.log('Login successful:', response);
          console.log('Token:', localStorage.getItem('token'));
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (error) => {
          this.message = error.error?.message || 'Login failed.';
          this.isSuccess = false;
        },
      });
  }


  onRegister(event: Event, registerForm: any) {
    if (registerForm.valid) {
      this.message = 'Registration successful!';
      console.log('Register:', { username: this.username, email: this.email, password: this.password });
    }
  }
}
