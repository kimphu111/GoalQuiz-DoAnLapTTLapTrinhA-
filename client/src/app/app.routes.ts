import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthGuard } from './guards/auth.guards';
import { AdminGuard } from './guards/admin.guards';
import { AlbumQuizComponent } from './pages/Quiz/album-quiz/album-quiz.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PersonalPointsComponent } from './pages/personal-points/personal-points.component';
import { ReviewComponent } from './pages/review/review.component';
import { NavbarLayoutComponent } from './pages/navbar-layout/navbar-layout.component';
import { QuizQuestionComponent } from './pages/Quiz/quiz-question/quiz-question.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { QuizResultComponent } from './pages/Quiz/quiz-result/quiz-result.component';
import { QuizEditAdminComponent } from './pages/admin-only/quiz-edit-admin/quiz-edit-admin.component';
import { QuizHistoryAdminComponent } from './pages/admin-only/quiz-history-admin/quiz-history-admin.component';
import { CreateQuestionComponent } from './pages/admin-only/create-question/create-question.component';
import { AdminNavbarComponent } from './pages/admin-only/admin-navbar/admin-navbar.component';

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
      { path: 'points', component: PersonalPointsComponent },
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
