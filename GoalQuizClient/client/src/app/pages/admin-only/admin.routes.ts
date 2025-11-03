import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { QuizEditAdminComponent } from './quiz-edit-admin/quiz-edit-admin.component';
import { QuizHistoryAdminComponent } from './quiz-history-admin/quiz-history-admin.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { AuthGuard } from '../../guards/auth.guards';
import { AdminGuard } from '../../guards/admin.guards';
import { QuizUserAdminComponent } from './quiz-user-admin/quiz-user-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminNavbarComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'question-management', pathMatch: 'full' },
      { path: 'question-management', component: QuizEditAdminComponent },
      { path: 'quiz-history', component: QuizHistoryAdminComponent },
      { path: 'create-question', component: CreateQuestionComponent },
      { path: 'quiz-user', component: QuizUserAdminComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
