import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { HomeComponent } from '../pages/home/home.component';

@NgModule({
  declarations: [
    LoginComponent,
    // RegisterComponent,
    // HomeComponent,
  ],
  imports: [
    CommonModule, // Cung cấp ngStyle, ngIf, v.v.
    FormsModule, // Cung cấp ngForm, ngModel
    RouterModule, // Cung cấp routerLink
  ],
  exports: [
    LoginComponent,
    // RegisterComponent,
    // HomeComponent,
  ],
})
export class AuthModule {}
