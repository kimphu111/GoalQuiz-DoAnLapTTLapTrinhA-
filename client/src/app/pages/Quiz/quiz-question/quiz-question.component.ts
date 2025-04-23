import { Component } from '@angular/core';
import { Location, NgClass, CommonModule } from '@angular/common'; // Import CommonModule
import { QuizService } from '../../../services/quiz/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';

// Define Question interface
interface Question {
  id: number;
  level: string;
  question: string;
  options: string[];
  answer: string;
  url?: string; // Optional url field
}

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [NgClass, CommonModule], // Add CommonModule to imports
  templateUrl: './quiz-question.component.html',
  styleUrl: './quiz-question.component.scss'
})
export class QuizQuestionComponent {
  constructor(
    private location: Location,
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  questions: Question[] = [];
  currentQuestion: Question | null = null;
  currentIndex: number = 0;
  level: string = '';
  score: number = 0;

  selectedOption: string | null = null;
  answered: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.level = params['level'] || '';
      let filteredQuestions: Question[];

      if (this.level === 'mixed') {
        filteredQuestions = this.quizService.questions;
      } else {
        filteredQuestions = this.quizService.questions.filter(q => q.level === this.level);
      }

      if (filteredQuestions.length === 0) {
        console.log('No questions found for level:', this.level);
      }

      const shuffledQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
      this.questions = shuffledQuestions.slice(0, 5);

      this.currentIndex = 0;
      this.currentQuestion = this.questions[this.currentIndex];
      this.score = 0;
    });
  }

  selectAnswer(option: string): void {
    if (this.answered) return;
    this.selectedOption = option;
    this.answered = true;

    if (option === this.currentQuestion?.answer) {
      this.score++;
    }
    setTimeout(() => this.nextQuestion(), 1000);
  }

  nextQuestion(): void {
    this.currentIndex++;
    this.selectedOption = null;
    this.answered = false;

    if (this.currentIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentIndex];
    } else {
      this.currentQuestion = null;
      alert(`Quiz finished: Your score: ${this.score}/${this.questions.length}`);
      this.router.navigate(['/quiz']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  trackOption(index: number, option: string): string {
    return option;
  }
}
