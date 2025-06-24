import { Component, OnInit } from '@angular/core';
import { Location, NgClass, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { QuizService } from '../../../services/quiz/quiz.service';

// Define Question interface
interface RawQuestion {
  id: string;
  level: 'easy' | 'medium' | 'hard';
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  image?: string;
  score: number;
}

//Tạo giá trị ổn định cho trackBy
//Dùng để xáo trộn mảng mà vẫn giữ label nguyên vẹn
interface Option {
  label: string;
  text: string;
}

interface QuizQuestion extends RawQuestion {
  options: Option[];
  answer: string;
}

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './quiz-question.component.html',
  styleUrl: './quiz-question.component.scss'
})
export class QuizQuestionComponent implements OnInit {
  questions: QuizQuestion[] = [];
  currentQuestion: QuizQuestion | null = null;
  currentIndex: number = 0;
  level: string = '';
  score: number = 0;
  selectedOption: string | null = null;
  answered: boolean = false;
  questionResults: {isCorrect: boolean}[] = [];
  dateDoQuiz: string = '';
  dateFinishQuiz: string = '';
  quizDuration: number = 0;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.level = params['level'] || 'easy';
      // Lấy ngày giờ theo định dạng ISO 8601 (UTC)
      this.dateDoQuiz = new Date().toISOString();
      localStorage.setItem('dateDoQuiz', this.dateDoQuiz);
      this.fetchQuiz();
    });
  }

  fetchQuiz(): void {
    this.quizService.getQuiz(this.level).subscribe({
      next: (res) => {
        if (!res || !res.success || !res.data) {
          console.log('No quiz data received!');
          this.router.navigate(['/quiz']);
          return;
        }
        this.questions = res.data.map((q: RawQuestion) => {
          const options: Option[] = this.shuffleArray([
            { label: 'A', text: q.answerA },
            { label: 'B', text: q.answerB },
            { label: 'C', text: q.answerC },
            { label: 'D', text: q.answerD }
          ]);

          return {
            ...q,
            options,
            answer: q.correctAnswer,
          };
        });

        this.currentIndex = 0;
        this.score = 0;
        // this.dateDoQuiz = new Date().toISOString();
        // localStorage.setItem('dateDoQuiz', this.dateDoQuiz);
        //this.questionResults = []; // Reset questionResults
        this.setCurrentQuestion();
      },
      error: () => {
        this.router.navigate(['/quiz']);
      }
    });
  }

  setCurrentQuestion(): void {
    this.currentQuestion = this.questions[this.currentIndex];
    this.selectedOption = null;
    this.answered = false;
  }

  selectAnswer(option: string): void {
    if (this.answered || !this.currentQuestion) return;

    this.selectedOption = option;
    this.answered = true;

    const isCorrect = option === this.currentQuestion.answer;
    this.questionResults[this.currentIndex] = {
      isCorrect
    };

    // if (isCorrect) {
    //   this.score++;
    // }

    // Lấy dateFinishQuiz theo định dạng ISO 8601
    this.dateFinishQuiz = new Date().toISOString();

    this.quizService.submitAnswer({
      idQuestion: this.currentQuestion.id,
      chooseAnswer: option,
      dateDoQuiz: this.dateDoQuiz,
      quizLevel: this.level,
      dateFinishQuiz: this.dateFinishQuiz,
    }).pipe(
      catchError((err) => {
        console.error('Gửi kết quả thất bại:', err);
        return of(null);
      })
    ).subscribe({
      next: (res => console.log('Kết quả đã gửi:', res)),
      error: (err) => console.error('Gửi kết quả thất bại:', err)
    });

    // Lưu questionResults vào sessionStorage
    //sessionStorage.setItem('questionResults', JSON.stringify(this.questionResults));

    setTimeout(() => this.nextQuestion(), 1300);
  }

  nextQuestion(): void {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.setCurrentQuestion();
    } else {
      const userId = localStorage.getItem('userId');

      console.log('Kết quả quiz:', this.questionResults);
      console.log('questionResults:', this.questionResults);
      console.log('userId:', userId, 'quizLevel:', this.level);

      // Lấy dateFinishQuiz theo định dạng ISO 8601
      this.dateFinishQuiz = new Date().toISOString();

      const dateFinishQuiz = this.dateFinishQuiz;
      this.calculateQuizDuration(this.dateDoQuiz, dateFinishQuiz);
      sessionStorage.setItem('fromQuizQuestion', '1');
      sessionStorage.setItem('quizDuration', this.quizDuration.toString());



      this.router.navigate(['/quiz-result'], {
        queryParams: { level: this.level}
      });
    }
  }

  private calculateQuizDuration(dateDoQuiz: string, dateFinishQuiz: string): void {
    const start = new Date(dateDoQuiz).getTime();
    const end = new Date(dateFinishQuiz).getTime();
    this.quizDuration = Math.floor((end - start) / 1000); // Tính bằng giây
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  goBack(): void {
    this.location.back();
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
