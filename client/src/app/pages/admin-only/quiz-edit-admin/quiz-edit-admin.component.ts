import { Component } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-quiz-edit-admin',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './quiz-edit-admin.component.html',
  styleUrl: './quiz-edit-admin.component.scss'
})
export class QuizEditAdminComponent {

}
