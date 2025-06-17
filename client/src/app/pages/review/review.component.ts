import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../services/quiz/quiz.service';

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  date: Date;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {
  currentLevel = 'mix';
  showDateFilter = false;
  calendarMonth = new Date();
  calendarDays: CalendarDay[] = [];
  selectedDate = '';
  noResult = false;
  quizAttempts: any[] = [];

  constructor(
    private router: Router,
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.fetchQuizzes();
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  generateCalendar(): void {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const leadingEmptyCells = startDay === 0 ? 6 : startDay - 1;
    this.calendarDays = [];

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = leadingEmptyCells; i > 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDate - i + 1);
      this.calendarDays.push({
        day: date.getDate(),
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        date
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const formatted = this.formatDate(date);
      this.calendarDays.push({
        day,
        isCurrentMonth: true,
        isSelected: this.selectedDate === formatted,
        isToday: isSameDay(date, today),
        date
      });
    }

    const remaining = 42 - this.calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({
        day: date.getDate(),
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        date
      });
    }
  }

  previousMonth(): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() - 1,
      1
    );
    this.selectedDate = '';
    this.generateCalendar();
    this.fetchQuizzes();
  }

  nextMonth(): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + 1,
      1
    );
    this.selectedDate = '';
    this.generateCalendar();
    this.fetchQuizzes();
  }

  fetchQuizzes(): void {
    const filterDate = this.selectedDate || this.formatDate(new Date());
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Thiếu thông tin người dùng. Vui lòng đăng nhập lại.');
      this.quizAttempts = [];
      this.noResult = true;
      return;
    }

    this.quizService.getUserResults(userId, filterDate, this.currentLevel).subscribe({
      next: (res) => {
        if (!Array.isArray(res.results) || res.results.length === 0) {
          this.quizAttempts = [];
          this.noResult = true;
          return;
        }

        // Chuyển đổi dữ liệu thành quizAttempts
        this.quizAttempts = [{
          idUser: userId,
          dateDoQuiz: filterDate,
          quizLevel: this.currentLevel,
          results: res.results,
          totalScore: res.totalScore,
          totalQuestions: res.totalQuestions
        }];
        this.noResult = false;
      },
      error: (err) => {
        console.error('Error fetching quizzes:', err);
        this.quizAttempts = [];
        this.noResult = true;
        if (err.status === 404) {
          alert('Không tìm thấy kết quả bài quiz cho ngày này.');
        } else if (err.status === 401) {
          alert('Không thể tải danh sách bài quiz. Vui lòng đăng nhập lại.');
        } else {
          alert('Có lỗi xảy ra khi tải danh sách bài quiz.');
        }
      }
    });
  }

  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    this.selectedDate = this.formatDate(day.date);
    this.calendarDays = this.calendarDays.map(d => ({
      ...d,
      isSelected: d.date.getTime() === day.date.getTime(),
    }));
    this.fetchQuizzes();
  }

  toggleDateFilter(): void {
    this.showDateFilter = !this.showDateFilter;
  }

  closeDateFilter(): void {
    this.showDateFilter = false;
  }

  selectLevel(level: string): void {
    this.currentLevel = level;
    this.fetchQuizzes();
  }

  goToResult(quiz: any): void {
    this.router.navigate(['/quiz-result'], {
      queryParams: {
        level: quiz.quizLevel?.toLowerCase() || this.currentLevel,
        dateDoQuiz: quiz.dateDoQuiz
      }
    });
  }
}
