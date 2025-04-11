import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NgChartsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  username: string = 'Guest';
  isLoading: boolean = false;
  currentMonth: string = 'Tháng Tư';
  daysInMonth: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
  highlightedDays: number[] = [5, 10, 15, 20];
  isBrowser: boolean; // Biến kiểm tra môi trường

  // Dữ liệu biểu đồ
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
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {
    // Kiểm tra môi trường ngay trong constructor
    this.isBrowser = isPlatformBrowser(this.platformId);
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
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  prevMonth() {
    this.currentMonth = 'Tháng Ba';
  }

  nextMonth() {
    this.currentMonth = 'Tháng Năm';
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
        }
        this.router.navigate(['/auth']);
      }
    });
  }
}
