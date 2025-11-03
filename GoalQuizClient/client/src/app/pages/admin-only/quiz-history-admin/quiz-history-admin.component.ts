import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  selector: 'app-quiz-history-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './quiz-history-admin.component.html',
  styleUrls: ['./quiz-history-admin.component.scss'],
})
export class QuizHistoryAdminComponent implements OnInit {
  selectedDate: string = '';
  filteredQuizzes: Quiz[] = [];
  paginatedQuizzes: Quiz[] = [];
  itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 0;
  currentDate: string = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
  });
  showDateFilter = false;
  calendarMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];

  quizzes: Quiz[] = [
    {
      id: 1,
      title: 'Cầu thủ nào giành Quả bóng Vàng nhiều nhất trong mùa 2025?',
      createdAt: new Date('2025-05-01'),
      participants: [
        { name: 'An', submittedAt: new Date('2025-05-01T09:23:00') },
        { name: 'Bình', submittedAt: new Date('2025-05-01T10:12:00') },
      ],
    },
    {
      id: 2,
      title: 'Quốc gia nào vô địch World Cup 2018?',
      createdAt: new Date('2025-05-01'),
      participants: [
        { name: 'Trang', submittedAt: new Date('2025-05-01T14:05:00') },
      ],
    },
    {
      id: 3,
      title: 'Ai là vua phá lưới World Cup mọi thời đại?',
      createdAt: new Date('2025-05-01'),
      participants: [],
    },
    {
      id: 4,
      title: 'Quả bóng vàng FIFA 2023 được trao cho ai?',
      createdAt: new Date('2025-05-01'),
      participants: [
        { name: 'Minh', submittedAt: new Date('2025-05-01T08:45:00') },
      ],
    },
    {
      id: 5,
      title: 'Môt trận bóng đá nào thắng nhiều bàn nhất (kỷ lục bóng đá)?',
      createdAt: new Date('2025-05-01'),
      participants: [
        { name: 'Long', submittedAt: new Date('2025-05-01T09:10:00') },
      ],
    },
    {
      id: 6,
      title: 'CLB nào vô địch UEFA Champions League nhiều nhất?',
      createdAt: new Date('2025-05-01'),
      participants: [
        { name: 'Huy', submittedAt: new Date('2025-05-01T11:00:00') },
      ],
    },
    {
      id: 7,
      title: 'Đội nào vô địch giải bóng đá ngoại hạng Anh mùa giải 2023-2024?',
      createdAt: new Date('2025-05-01'),
      participants: [
        { name: 'Nam', submittedAt: new Date('2025-05-01T12:00:00') },
      ],
    },
    {
      id: 8,
      title: 'Quốc gia nào vô địch World Cup 2022?',
      createdAt: new Date('2025-05-01'),
      participants: [
        { name: 'Lan', submittedAt: new Date('2025-05-01T13:00:00') },
      ],
    },
    //gen cho toi 10quiz voi 10 ngaay khac nhau
    {
      id: 9,
      title: 'Ai là cầu thủ ghi bàn nhiều nhất trong lịch sử bóng đá?',
      createdAt: new Date('2025-05-02'),
      participants: [
        { name: 'Thành', submittedAt: new Date('2025-05-02T09:23:00') },
      ],
    },
    {
      id: 10,
      title: 'Đội nào vô địch Euro 2020?',
      createdAt: new Date('2025-05-03'),
      participants: [
        { name: 'Phúc', submittedAt: new Date('2025-05-03T10:12:00') },
      ],
    },
    {
      id: 11,
      title: 'Ai là cầu thủ xuất sắc nhất thế giới năm 2023?',
      createdAt: new Date('2025-05-04'),
      participants: [
        { name: 'Khoa', submittedAt: new Date('2025-05-04T14:05:00') },
      ],
    },
    {
      id: 12,
      title: 'Đội nào vô địch Copa America 2021?',
      createdAt: new Date('2025-05-05'),
      participants: [
        { name: 'Hải', submittedAt: new Date('2025-05-05T08:45:00') },
      ],
    },
    {
      id: 13,
      title: 'Ai là cầu thủ ghi bàn nhiều nhất trong lịch sử Champions League?',
      createdAt: new Date('2025-05-06'),
      participants: [
        { name: 'Duy', submittedAt: new Date('2025-05-06T09:10:00') },
      ],
    },
    {
      id: 14,
      title: 'Đội nào vô địch giải bóng đá nữ thế giới 2019?',
      createdAt: new Date('2025-05-07'),
      participants: [
        { name: 'Ngọc', submittedAt: new Date('2025-05-07T11:00:00') },
      ],
    },
    {
      id: 15,
      title: 'Ai là cầu thủ đầu tiên ghi bàn trong lịch sử World Cup?',
      createdAt: new Date('2025-05-08'),
      participants: [
        { name: 'Thắng', submittedAt: new Date('2025-05-08T12:00:00') },
      ],
    },
    {
      id: 16,
      title: 'Đội nào vô địch giải bóng đá U23 châu Á năm 2018?',
      createdAt: new Date('2025-05-09'),
      participants: [
        { name: 'Bảo', submittedAt: new Date('2025-05-09T13:00:00') },
      ],
    },
    {
      id: 17,
      title: 'Ai là cầu thủ đầu tiên ghi bàn trong lịch sử Euro?',
      createdAt: new Date('2025-05-10'),
      participants: [
        { name: 'Linh', submittedAt: new Date('2025-05-10T09:23:00') },
      ],
    },
    {
      id: 18,
      title: 'Đội nào vô địch giải bóng đá U20 thế giới năm 2019?',
      createdAt: new Date('2025-05-11'),
      participants: [
        { name: 'Quân', submittedAt: new Date('2025-05-11T10:12:00') },
      ],
    },
    {
      id: 19,
      title: 'Ai là cầu thủ đầu tiên ghi bàn trong lịch sử World Cup nữ?',
      createdAt: new Date('2025-05-12'),
      participants: [
        { name: 'Hương', submittedAt: new Date('2025-05-12T14:05:00') },
      ],
    },
    {
      id: 20,
      title: 'Đội nào vô địch giải bóng đá U19 châu Á năm 2018?',
      createdAt: new Date('2025-05-13'),
      participants: [
        { name: 'Mai', submittedAt: new Date('2025-05-13T08:45:00') },
      ],
    },
  ];

  ngOnInit() {
    this.filteredQuizzes = [...this.quizzes];
    this.filteredQuizzes.forEach((q) => (q.showParticipants = false));
    this.updatePagination();
    this.generateCalendar();
  }
  generateCalendar() {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();
    const firstDay = new Date(year, month, 0);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const today = new Date();

    this.calendarDays = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        date,
      });
    }

    // Add current month's days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isSelected = this.selectedDate === date.toISOString().split('T')[0];
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      this.calendarDays.push({
        day,
        isCurrentMonth: true,
        isSelected,
        isToday,
        date,
      });
    }

    // Add next month's days to fill the grid
    const remainingDays = 42 - this.calendarDays.length; // 6 rows * 7 columns
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push({
        day,
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

  selectDay(day: CalendarDay) {
    if (!day.isCurrentMonth) return; // Only allow selecting current month's days
    this.selectedDate = day.date.toISOString().split('T')[0];
    this.calendarDays.forEach((d) => (d.isSelected = false));
    day.isSelected = true;
    this.searchByDate();
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
    if (!this.selectedDate) {
      this.filteredQuizzes = [...this.quizzes];
    } else {
      const selected = new Date(this.selectedDate);
      this.filteredQuizzes = this.quizzes.filter((q) => {
        const quizDate = new Date(q.createdAt);
        return (
          quizDate.getFullYear() === selected.getFullYear() &&
          quizDate.getMonth() === selected.getMonth() &&
          quizDate.getDate() === selected.getDate()
        );
      });
    }
    this.currentPage = 1; // Reset về trang 1 khi lọc
    this.updatePagination();
  }

  toggleDateFilter() {
    this.showDateFilter = !this.showDateFilter;
  }

  closeDateFilter() {
    this.showDateFilter = false;
  }
  clearDate() {
    this.selectedDate = '';
    this.calendarDays.forEach((d) => (d.isSelected = false));
    this.searchByDate();
  }
}
