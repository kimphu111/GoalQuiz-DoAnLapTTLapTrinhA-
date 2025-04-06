// src/app/pages/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  onRegister(event: Event, form: NgForm) {
    event.preventDefault();

    if (form.invalid) {
      this.message = 'Please fill in all fields.';
      return;
    }

    const registerData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.http
      .post('http://localhost:3000/api/auth/register', registerData)
      .subscribe({
        next: (response: any) => {
          this.message = response.message || 'Registration successful!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (error) => {
          this.message = error.error?.message || 'Registration failed.';
        },
      });
  }
}
