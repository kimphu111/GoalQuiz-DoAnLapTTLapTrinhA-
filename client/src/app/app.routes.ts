import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {AuthComponent} from './pages/auth/auth.component';
import {AuthGuard} from './guards/auth.guards';
import {AlbumQuizComponent} from './pages/album-quiz/album-quiz.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {PersonalPointsComponent} from './pages/personal-points/personal-points.component';
import {ReviewComponent} from './pages/review/review.component';
import {navbarLayoutComponent} from './pages/navbar-layout/navbar-layout.component';

export const routes: Routes = [
  {
    path: '', component: navbarLayoutComponent,
    children:[
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'auth', component: AuthComponent },
      { path: 'quiz', component: AlbumQuizComponent }, // Placeholder route
      { path: 'points', component: PersonalPointsComponent }, // Placeholder route
      { path: 'profile', component: ProfileComponent }, // Placeholder route
      { path: 'review', component: ReviewComponent },
  ]

  },

  { path: 'home', component: HomeComponent },


];
