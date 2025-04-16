import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthGuard } from './guards/auth.guards';
import { AlbumQuizComponent } from './pages/album-quiz/album-quiz.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PersonalPointsComponent } from './pages/personal-points/personal-points.component';
import { ReviewComponent } from './pages/review/review.component';
import { navbarLayoutComponent } from './pages/navbar-layout/navbar-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '',
    component: navbarLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'quiz', component: AlbumQuizComponent },
      { path: 'points', component: PersonalPointsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'review', component: ReviewComponent },
    ],
  },
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: 'auth' }, // Xử lý 404
];
