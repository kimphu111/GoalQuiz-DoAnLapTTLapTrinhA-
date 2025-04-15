import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NgChartsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  username: string = '';
  isLoading: boolean = false;
  currentMonth: string = '';
  currentYear: number = new Date().getFullYear();
  currentMonthIndex: number = new Date().getMonth();
  daysInMonth: number[] = [];
  highlightedDays: number[] = [5, 10, 15, 20];
  isBrowser: boolean;
  isDarkMode: boolean = false;

  isSidebarVisible = true;
  private months: string[] = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];

  barChartData: ChartData<'bar'> = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'],
    datasets: [
      {
        data: [65, 59, 80, 81],
        label: 'Điểm số',
        backgroundColor: '#38a565',
        borderColor: '#38a565',
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Điểm' }
      }
    },
    plugins: {
      legend: { display: true }
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadTheme();
    this.updateCalendar();
  }

  ngOnInit() {
    this.isLoading = true;

    if (this.isBrowser) {
      this.username = localStorage.getItem('username') || 'Guest';
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/auth']);
        return;
      }
      this.applyTheme();
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private fetchUserProfile() {
    this.http.get('http://localhost:3000/api/auth', {
      headers: { Authorization: `Bearer ${this.authService.getAccessToken()}` }
    }).subscribe({
      next: (response: any) => {
        this.username = response.user.username || response.user.email || 'Guest';
        localStorage.setItem('username', this.username);
        console.log('Username from API:', this.username);
      },
      error: (error) => {
        console.error('Lỗi lấy thông tin người dùng:', error);
        this.username = 'Guest';
      }
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  prevMonth() {
    this.currentMonthIndex--;
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    }
    this.updateCalendar();
  }

  nextMonth() {
    this.currentMonthIndex++;
    if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    }
    this.updateCalendar();
  }

  private loadTheme() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      console.log('savedTheme:', savedTheme);
      this.isDarkMode = savedTheme !== 'light';
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isBrowser) {
      document.body.classList.toggle('light-mode', !this.isDarkMode);
    }
  }

  private updateCalendar() {
    const date = new Date(this.currentYear, this.currentMonthIndex, 1);
    this.currentMonth = `${this.months[this.currentMonthIndex]} ${this.currentYear}`;
    const daysInMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
    this.daysInMonth = [];

    // Chỉ thêm các ngày thực (bỏ qua việc thêm số 0 để căn chỉnh)
    for (let i = 1; i <= daysInMonth; i++) {
      this.daysInMonth.push(i);
    }
  }

  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() &&
      this.currentMonthIndex === today.getMonth() &&
      this.currentYear === today.getFullYear();
  }

  onLogout() {
    this.http.post('http://localhost:3000/api/auth/logout', {}).subscribe({
      next: () => {
        if (this.isBrowser) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('username');
          localStorage.removeItem('refreshToken');
        }
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Lỗi đăng xuất:', error);
        if (this.isBrowser) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('username');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('theme');
          localStorage.removeItem('accessToken');
        }
        this.router.navigate(['/auth']);
      }
    });
  }
}
