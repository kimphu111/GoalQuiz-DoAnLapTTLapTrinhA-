import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../../services/quiz/quiz.service';
import {
  format,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  subDays,
  addDays,
  isSameDay,
} from 'date-fns';
interface Participant {
  name: string;
  submittedAt: Date;
}

interface Quiz {
  id: number;
  title: string;
  createdAt: Date;
  participants: Participant[];
  showParticipants?: boolean;
}

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  date: Date;
}
@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss',
})
export class AdminNavbarComponent implements OnInit {
  @ViewChild('searchInput') searchInput: any; // de tham chieu den input tim kiem o component khác
  selectedDate: string = '';
  filteredQuizzes: Quiz[] = [];
  paginatedQuizzes: Quiz[] = [];
  itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 0;
  currentDate: string = format(new Date(), 'dd/MM/yyyy');
  showDateFilter = false;
  calendarMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];

  constructor(
    private router: Router,
    protected quizService: QuizService,
  ) {}

  ngOnInit() {
    this.filteredQuizzes.forEach((q) => (q.showParticipants = false));
    this.updatePagination();
    this.generateCalendar();
    this.quizService.selectedDate$.subscribe((date) => {
      this.selectedDate = date;
      this.calendarDays.forEach((d) => {
        d.isSelected = d.date && format(d.date, 'yyyy-MM-dd') === date;
      });
    });
  }
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.trim();
    this.quizService.setSearchTerm(searchTerm);
  }

  clearSearch(): void {
    console.log('Clear search called');
    this.quizService.setSearchTerm('');
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.value = '';
    }
    this.quizService.refreshFilter(); // Kích hoạt làm mới bộ lọc
  }
  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    console.log('Day clicked:', day); // Debug
    this.selectedDate = format(day.date, 'yyyy-MM-dd');
    console.log('Selected date:', this.selectedDate); // Debug
    this.calendarDays.forEach((d) => (d.isSelected = false));
    day.isSelected = true;
    this.quizService.setSelectedDate(this.selectedDate);
    this.showDateFilter = false;
  }

  clearDate() {
    this.selectedDate = 'mixed';
    this.calendarDays.forEach((d) => (d.isSelected = false));
    this.quizService.setSelectedDate(''); // Gửi rỗng để reset filter
    this.showDateFilter = false;
  }

  generateCalendar() {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();
    const firstDayOfMonth = startOfMonth(new Date(year, month, 1));
    const lastDayOfMonth = endOfMonth(new Date(year, month));
    const startDay =
      firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Thứ 2 là ngày đầu tuần
    const totalDays = getDaysInMonth(new Date(year, month));
    const today = new Date();

    this.calendarDays = [];

    // Thêm ngày của tháng trước
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = subDays(firstDayOfMonth, i + 1);
      this.calendarDays.push({
        day: date.getDate(),
        isCurrentMonth: false,
        isSelected: false,
        isToday: isSameDay(date, today),
        date,
      });
    }

    // Thêm ngày của tháng hiện tại
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isSelected = this.selectedDate === format(date, 'yyyy-MM-dd');
      const isToday = isSameDay(date, today);
      this.calendarDays.push({
        day,
        isCurrentMonth: true,
        isSelected,
        isToday,
        date,
      });
    }

    // Thêm ngày của tháng sau
    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = addDays(lastDayOfMonth, day);
      this.calendarDays.push({
        day: date.getDate(),
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        date,
      });
    }
  }

  previousMonth() {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() - 1,
      1,
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + 1,
      1,
    );
    this.generateCalendar();
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.filteredQuizzes.length / this.itemsPerPage,
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedQuizzes = this.filteredQuizzes.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  searchByDate() {
    if (this.selectedDate) {
      this.router.navigate([], {
        queryParams: { date: this.selectedDate },
        queryParamsHandling: 'merge', // Giữ các params khác nếu có
      });
    } else {
      this.router.navigate([], {
        queryParams: { date: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  toggleDateFilter() {
    this.showDateFilter = !this.showDateFilter;
  }

  closeDateFilter() {
    this.showDateFilter = false;
  }
}
