import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { QuizService } from '../../../services/quiz/quiz.service';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.scss'
})
export class QuizResultComponent implements OnInit {
  questionResults: any[] = [];
  userId: string = '';
  quizLevel: string = '';
  score: number = 0;
  quizTime: string = '';
  quizDate: string = '';

  //Phu lam
  quizDuration : string = '';
//
  latestResults: Record<string, any[]> = {};
  selectedResult: any = null;
  showPopup: boolean = false;

  constructor(
    private router: Router,
    private quizService: QuizService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';

    this.route.queryParams.subscribe(params => {
      this.quizLevel = params['level'] || 'easy';
      const dateDoQuiz = params['dateDoQuiz'] || localStorage.getItem('dateDoQuiz') || '';

      if (this.userId && dateDoQuiz) {
        this.quizService.getUserResults(this.userId, dateDoQuiz, this.quizLevel).subscribe({
          next: (res) => {
            if (!Array.isArray(res.results)) {
              console.warn('Invalid data format from API');
              return;
            }

            this.questionResults = res.results.map((item: any) => ({
              ...item,
              isCorrect: item.result,
              options: item.quiz ? [
                item.quiz?.answerA,
                item.quiz?.answerB,
                item.quiz?.answerC,
                item.quiz?.answerD
              ] : [],
              questionText: item.quiz?.question || 'No data',
              correctAnswer: item.quiz?.correctAnswer || '',
              chooseAnswer: item.chooseAnswer,
              image: item.quiz?.image || ''
            }));

            this.score = res.totalScore || 0;

            const dateObj = new Date(dateDoQuiz);
            this.quizDate = dateObj.toLocaleDateString('vi-VN');
            this.quizTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            // Save multiple results for each level
            const key = `latestQuizResult_${this.quizLevel}`;
            let oldArr: any;
            try{
              oldArr = JSON.parse(localStorage.getItem(key) || '[]' );
              if(!Array.isArray(oldArr)) oldArr = [];
            }catch {
              oldArr = [];
            }
            const newResult = {
              dateDoQuiz,
              quizLevel: this.quizLevel,
              score: this.score,
              totalQuestions: res.totalQuestions,
              results: this.questionResults
            };
            oldArr.push(newResult);
            localStorage.setItem(key, JSON.stringify(oldArr));

            // Also store in memory for reuse
            this.latestResults[this.quizLevel] = oldArr;
          },
          error: (err) => {
            console.error('Failed to load quiz results:', err);
            this.questionResults = [];
            this.score = 0;
          }
        });
      }

      // Load all latest results from localStorage (for reuse or display)
      ['easy', 'medium', 'hard', 'mix'].forEach(level => {
        const stored = localStorage.getItem(`latestQuizResult_${level}`);
        this.latestResults[level] = stored ? JSON.parse(stored) : [];
      });

      // Nếu không có kết quả thì xóa hiện thị
      const currentResults = this.latestResults[this.quizLevel];
      if (!Array.isArray(currentResults) || currentResults.length === 0) {
        this.questionResults = [];
      } else {
        // Lấy lần làm gần nhất để hiển thị mặc định
        const lastResult = currentResults[currentResults.length - 1];
        this.questionResults = lastResult?.results || [];
        this.score = lastResult?.score || 0;
        if (lastResult?.dateDoQuiz) {
          const dateObj = new Date(lastResult.dateDoQuiz);
          this.quizDate = dateObj.toLocaleDateString('vi-VN');
          this.quizTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
      }
    });


    //Phu code
    // Lưu thời gian bắt đầu khi quiz được khởi tạo
    const startTime = new Date().toISOString();
    localStorage.setItem('quizStartTime', startTime);
    localStorage.setItem('dateDoQuiz', startTime); // Đồng bộ với dateDoQuiz
  }

  showQuestionDetail(result: any, index: number): void {
    this.selectedResult = { ...result, index };
    this.showPopup = true;
  }

  closePopup(): void {
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

  getAnswerKey(index: number): string {
    return index >= 0 && index < 4 ? String.fromCharCode(65 + index) : '';
  }



  // tao code (Phu)
  startQuiz(level: string): void {
    // Gọi API để lấy câu hỏi
    this.quizService.getQuiz(level).subscribe({
      next: (res) => {
        // Xử lý câu hỏi
      },
      error: (err) => console.error('Lỗi khi lấy quiz:', err)
    });
  }
}
