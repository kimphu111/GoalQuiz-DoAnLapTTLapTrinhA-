import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    AuthModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MatSnackBarModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }), // Cần cho SSR
    BrowserAnimationsModule, // Cần cho Angular Material
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: {} }, // Cung cấp cấu hình cho JwtHelperService
    JwtHelperService, // Cung cấp JwtHelperService
  ],
})
export class AppModule {}
