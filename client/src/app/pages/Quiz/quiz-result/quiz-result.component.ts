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
  quizDuration: string = '';
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
      const quizDuration = Number(sessionStorage.getItem('quizDuration')) || 0;
      this.quizTime = this.formatDuration(quizDuration);


      // Định dạng quizDate
      const dateObj = new Date(dateDoQuiz);
      this.quizDate = dateObj.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      console.log(this.quizDate);

      if (this.userId && dateDoQuiz) {
        this.quizService.getUserResults(this.userId, dateDoQuiz, this.quizLevel).subscribe({
          next: (res) => {
            if (!Array.isArray(res.results)) {
              console.warn('Invalid data format from API');
              this.questionResults = [];
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
              ].filter(Boolean) : [], // Đảm bảo options là mảng
              questionText: item.quiz?.question || 'Không có dữ liệu',
              correctAnswer: item.quiz?.correctAnswer || '',
              chooseAnswer: item.chooseAnswer || '',
              image: item.quiz?.image || ''
            }));

            this.score = res.totalScore || 0;

            // Lưu kết quả vào localStorage
            const key = `latestQuizResult_${this.quizLevel}`;
            let oldArr: any[] = [];
            try {
              oldArr = JSON.parse(localStorage.getItem(key) || '[]');
              if (!Array.isArray(oldArr)) oldArr = [];
            } catch {
              oldArr = [];
            }
            const newResult = {

              dateDoQuiz,
              quizLevel: this.quizLevel,
              score: this.score,
              totalQuestions: res.totalQuestions,
              results: this.questionResults,
              quizDuration,
            };
            oldArr.push(newResult);
            localStorage.setItem(key, JSON.stringify(oldArr));

            // Lưu vào latestResults
            this.latestResults[this.quizLevel] = oldArr;
          },
          error: (err) => {
            console.error('Failed to load quiz results:', err);
            this.questionResults = [];
            this.score = 0;
            console.log(this.quizDate);
          }
        });
      }

      // Load tất cả kết quả từ localStorage
      ['easy', 'medium', 'hard', 'mix'].forEach(level => {
        const stored = localStorage.getItem(`latestQuizResult_${level}`);
        this.latestResults[level] = stored ? JSON.parse(stored) : [];
      });

      // Hiển thị kết quả mặc định từ latestResults
      const currentResults = this.latestResults[this.quizLevel];
      if (!Array.isArray(currentResults) || currentResults.length === 0) {
        this.questionResults = [];
      } else {
        const lastResult = currentResults[currentResults.length - 1];
        this.questionResults = lastResult?.results.map((item: any) => ({
          ...item,
          options: Array.isArray(item.options) ? item.options : [] // Đảm bảo options là mảng
        })) || [];
        this.score = lastResult?.score || 0;
        if (lastResult?.dateDoQuiz) {
          const dateObj = new Date(lastResult.dateDoQuiz);
          this.quizDate = dateObj.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        }
      }
    });
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (seconds === 0) {
      return '0 giây';
    }
    if (minutes === 0) {
      return `${remainingSeconds} giây`;
    }
    if (remainingSeconds === 0) {
      return `${minutes} phút`;
    }
    return `${minutes} phút ${remainingSeconds} giây`;
  }

  showQuestionDetail(result: any, index: number): void {
    this.selectedResult = {
      ...result,
      index,
      options: Array.isArray(result.options) ? result.options : [] // Đảm bảo options là mảng
    };
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

  startQuiz(level: string): void {
    this.quizService.getQuiz(level).subscribe({
      next: (res) => {
        // Xử lý câu hỏi
      },
      error: (err) => console.error('Lỗi khi lấy quiz:', err)
    });
  }

  protected readonly Array = Array;
}
