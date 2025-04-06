import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  onLogin(event: Event, form: NgForm) {
    event.preventDefault();

    if (form.invalid) {
      this.message = 'Please fill in all fields.';
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
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (error) => {
          this.message = error.error?.message || 'Login failed.';
        },
      });
  }
}
