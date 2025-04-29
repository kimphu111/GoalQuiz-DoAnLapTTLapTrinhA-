import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.scss'
})
export class QuizResultComponent {
  questionResults: { isCorrect: boolean }[] = [];
  userId: string = '';
  quizLevel: string = '';
  score: number = 0;

  constructor(private router: Router, private http: HttpClient) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state;

    if (state) {
      this.userId = state['userId'];
      this.quizLevel = state['quizLevel'];
      this.questionResults = state['questionResults'] || [];
      this.score = this.questionResults.filter(q => q.isCorrect).length;
    }
  }
}
