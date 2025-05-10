import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';

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

  constructor(private router: Router,
              private http: HttpClient,
              private location: Location,
              private route: ActivatedRoute
            ) {

              this.userId = localStorage.getItem('userId') || '';
              this.route.queryParams.subscribe(params => {
                let level = params['level'] || 'easy';
                console.log('Level: ', level);
                this.quizLevel = level;
              })

              const token = localStorage.getItem('accessToken');
              const httpOptions = token
                ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }// Xác thực người dùng
                : {};


              // Gọi API lấy kết quả từ DB
              if(this.userId && this.quizLevel){
                this.http.post<any>(`http://localhost:8000/api/play/postPlayerResult`,
                  { userId: this.userId, quizLevel: this.quizLevel },
                  httpOptions
                )
                  .subscribe(res => {
                    this.questionResults = res.data || [];
                    this.score = this.questionResults.filter(q => q.isCorrect).length;
                  });
              }
  }


  goBack(): void {
    const fromQuiz = sessionStorage.getItem('fromQuizQuestion');
    if (fromQuiz === '1') {
      sessionStorage.removeItem('fromQuizQuestion');
      this.router.navigate(['/quiz']);
    } else {
      this.location.back();
    }
  }
}
