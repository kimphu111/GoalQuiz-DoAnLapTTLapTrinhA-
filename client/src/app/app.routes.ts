import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {AuthComponent} from './pages/auth/auth.component';
import {AuthGuard} from './guards/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomeComponent },
  { path: 'points', component: HomeComponent }, // Placeholder route
  { path: 'info', component: HomeComponent }, // Placeholder route
  { path: 'edit-info', component: HomeComponent }, // Placeholder route
  { path: 'quiz', component: HomeComponent }, // Placeholder route
  { path: 'review', component: HomeComponent }, // Placeholder route
];
