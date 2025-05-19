import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.scss'
})
export class QuizResultComponent {
  questionResults: { isCorrect: boolean }[] = [];
  userId: string = '';
  quizLevel: string = '';
  score: number = 0;

  latestEasy: any = {};
  latestMedium: any = {};
  latestHard: any = {};
  latestMix: any = {};

  selectedResult: any = null;
  showPopup: boolean = false;

  constructor(private router: Router,
              private http: HttpClient,
              private location: Location,
              private route: ActivatedRoute
            ) {

              this.userId = localStorage.getItem('userId') || '';
              this.route.queryParams.subscribe(params => {
                let level = params['level'] || 'easy';
                let dateDoQuiz = params['dateDoQuiz'] || localStorage.getItem('dateDoQuiz') || '';
                console.log(`Level: ${level} DateDoQuiz: ${dateDoQuiz}`);
                this.quizLevel = level;
                
                const token = localStorage.getItem('accessToken');
                const httpOptions = token
                ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }// Xác thực người dùng
                : {};
                
                
                // Gọi API lấy kết quả từ DB
                if(this.userId && dateDoQuiz){
                  this.http.get<any>(`http://localhost:8000/api/play/review?dateDoQuiz=${encodeURIComponent(dateDoQuiz)}&quizLevel${encodeURIComponent(this.quizLevel)}`,
                  httpOptions
                ).subscribe({
                    next: (res) => {
                      console.log('API response:', res)
                      // Map lại cho đúng với dữ liệu backend trả về 
                      this.questionResults = (res.results || [])
                        .map((item:any) => ({
                          ...item,
                          isCorrect: item.result,
                          options: [
                            item.quiz?.answerA,
                            item.quiz?.answerB,
                            item.quiz?.answerC,
                            item.quiz?.answerD
                          ],
                          questionText: item.quiz?.question,
                          correctAnswer: item.quiz?.correctAnswer,
                          chooseAnswer: item.chooseAnswer,
                          image: item.quiz?.image
                        }));
                        console.log('Mapped questionResults:', this.questionResults);
                      this.score = res.totalScore || 0;

                      // Lưu kết quả mới nhất theo level (ghi đè)
                      const key = `latestQuizResult_${this.quizLevel}`;
                      localStorage.setItem(key, JSON.stringify({
                        dateDoQuiz,
                        quizLevel: this.quizLevel,
                        score: this.score,
                        totalQuestions: res.totalQuestions,
                        results: this.questionResults
                      }));
                    },
                    error: (err) => {
                      this.questionResults = [];
                      this.score = 0;
                    }
                  });
                }
              });
  }

  ngOnInit(): void {
    this.latestEasy = JSON.parse(localStorage.getItem('latestQuizResult_easy') || '{}');
    this.latestMedium = JSON.parse(localStorage.getItem('latestQuizResult_medium') || '{}');
    this.latestHard = JSON.parse(localStorage.getItem('latestQuizResult_hard') || '{}');
    this.latestMix = JSON.parse(localStorage.getItem('latestQuizResult_mix') || '{}');
    console.log('Kết quả easy:', this.latestEasy);
    console.log('Kết quả medium:', this.latestMedium);
    console.log('Kết quả hard:', this.latestHard);
    console.log('Kết quả mix:', this.latestMix);

    // Nếu không có kết quả cho level hiện tại, xóa questionResults để hiển thị "chưa làm quiz"
    if (this.quizLevel === 'easy' && (!this.latestEasy.results || this.latestEasy.results.length === 0)) {
      this.questionResults = [];
    }
    if (this.quizLevel === 'medium' && (!this.latestMedium.results || this.latestMedium.results.length === 0)) {
      this.questionResults = [];
    }
    if (this.quizLevel === 'hard' && (!this.latestHard.results || this.latestHard.results.length === 0)) {
      this.questionResults = [];
    }
    if (this.quizLevel === 'mix' && (!this.latestMix.results || this.latestMix.results.length === 0)) {
      this.questionResults = [];
    }
  }

  showQuestionDetail(result: any){
    console.log('Show popup for:', result);
    this.selectedResult = result;
    this.showPopup = true;
  }

  closePopup(){
    this.showPopup = false;
    this.selectedResult = null;
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
