import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {navbarLayoutComponent} from '../pages/navbar-layout/navbar-layout.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    navbarLayoutComponent,
    // Cung cấp routerLink
  ],
  exports: [
  ],
})
export class AuthModule {}
