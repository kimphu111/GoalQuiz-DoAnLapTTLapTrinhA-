import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
export class ReviewComponent {
  currentLevel: string = 'mix';
  showDateFilter = false;
  calendarMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  selectedDate: string = '';
  noResult: boolean = false;
  quizzes: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.fetchQuizzes();
  }

  generateCalendar(): void {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startDay = firstDay.getDay();
    const leadingEmptyCells = startDay === 0 ? 6 : startDay - 1;

    this.calendarDays = [];

    // Helper to check today
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    // Previous month's trailing days
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = leadingEmptyCells; i > 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDate - i + 1);
      this.calendarDays.push({
        day: date.getDate(),
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        date,
      });
    }

    // Current month's days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const localDate = `${yyyy}-${mm}-${dd}`;
      this.calendarDays.push({
        day,
        isCurrentMonth: true,
        isSelected: this.selectedDate === localDate,
        isToday: isSameDay(date, today),
        date,
      });
    }

    // Next month's leading days to fill 6x7 grid
    const remainingCells = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({
        day: date.getDate(),
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        date,
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
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const filterDate = this.selectedDate || todayStr;
    const level = this.currentLevel === 'mixed' ? 'mix' : this.currentLevel;

    const token = localStorage.getItem('accessToken');
    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
    this.http.get<any>(
      `http://localhost:8000/api/play/review?dateDoQuiz=${filterDate}&quizLevel=${level}`,
      httpOptions
    ).subscribe({
      next: (res) => {
        this.quizzes = (res.results || []).map((item: any) => ({
          level: item.quizLevel || item.level || level,
          dateCreated: item.dateDoQuiz || filterDate,
          score: item.score || 0,
        }));
        this.noResult = this.quizzes.length === 0;
      },
      error: () => {
        this.quizzes = [];
        this.noResult = true;
      }
    });
  }

  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    const date = day.date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    this.selectedDate = `${yyyy}-${mm}-${dd}`; // chỉ lấy ngày/tháng/năm

    this.calendarDays = this.calendarDays.map((d) => ({
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

  goToResult(quiz: any) {
    this.router.navigate(['/quiz-result'], {
      queryParams: {
        level: quiz.level.toLowerCase(),
        dateDoQuiz: quiz.dateCreated
      }
    });
  }
}
