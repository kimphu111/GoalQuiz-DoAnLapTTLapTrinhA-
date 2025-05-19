import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { QuizEditAdminComponent } from './quiz-edit-admin/quiz-edit-admin.component';
import { QuizHistoryAdminComponent } from './quiz-history-admin/quiz-history-admin.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { AdminRoutingModule } from './admin.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminNavbarComponent,
    QuizEditAdminComponent,
    QuizHistoryAdminComponent,
    CreateQuestionComponent,
  ],
})
export class AdminModule {}
