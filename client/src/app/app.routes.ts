import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthGuard } from './guards/auth.guards';
import { AlbumQuizComponent } from './pages/Quiz/album-quiz/album-quiz.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReviewComponent } from './pages/review/review.component';
import { NavbarLayoutComponent } from './pages/navbar-layout/navbar-layout.component';
import { QuizQuestionComponent } from './pages/Quiz/quiz-question/quiz-question.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { QuizResultComponent } from './pages/Quiz/quiz-result/quiz-result.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '',
    component: NavbarLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'quiz', component: AlbumQuizComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'review', component: ReviewComponent },
      { path: 'quiz-question', component: QuizQuestionComponent },
      { path: 'ranking', component: RankingComponent },
      { path: 'quiz-result', component: QuizResultComponent },
    ],
  },
  { path: 'auth', component: AuthComponent },

  {
  path: 'admin',
  canActivate: [AuthGuard],
  loadChildren: () => import('./pages/admin-only/admin.routes').then(m => m.AdminRoutingModule)
  },

  { path: '**', redirectTo: 'auth' }, // Xử lý 404
];
