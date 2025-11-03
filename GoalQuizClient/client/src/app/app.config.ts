import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor} from './interceptors/auth.interceptor';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: JWT_OPTIONS, useValue: {} }, // Cung cấp cấu hình cho JwtHelperService
    JwtHelperService, // Cung cấp JwtHelperService
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([AuthInterceptor])),    provideClientHydration(),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(FormsModule),
    importProvidersFrom(CommonModule),
    importProvidersFrom(RouterModule.forRoot(routes)),
  ],
};
