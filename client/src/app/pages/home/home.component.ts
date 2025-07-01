import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { QuizService } from '../../services/quiz/quiz.service';

interface QuizAttempt {
  quizLevel: string;
  score: number;
  dateDoQuiz: string;
}

interface Player {
  idUser: string;
  totalScore: number;
  username: string;
  email: string;
  duration: string;
  level: string; // Thêm level để lưu cấp độ
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NgChartsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  username: string = '';
  email: string = '';
  isLoading: boolean = false;
  currentMonth: string = '';
  currentYear: number = new Date().getFullYear();
  currentMonthIndex: number = new Date().getMonth();
  daysInMonth: number[] = [];
  highlightedDays: number[] = [5, 10, 15, 20];
  isBrowser: boolean;
  isDarkMode: boolean = true;
  isSidebarVisible = true;
  isDesktop = window.innerWidth > 768;
  recentAttempts: { quizLevel: string; dateDoQuiz: string; totalScore: number }[] = [];

  // Dữ liệu cho biểu đồ cột
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Điểm số',
        backgroundColor: ['#3c7363', '#888df2', '#ffd2e4', '#C8C8C8'], // Màu theo rank
        borderColor: ['#3c7363', '#888df2', '#ffd2e4', '#C8C8C8'],
        borderWidth: 1,
      },
    ],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Điểm' },
      },
      x: {
        title: { display: true, text: 'Người chơi' },
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          // Tùy chỉnh tooltip để hiển thị tên và level
          label: (context) => {
            const index = context.dataIndex;
            const player = this.topPlayers[index];
            return `${player.username}: ${player.totalScore} điểm (Level: ${player.level})`;
          },
        },
      },
    },
  };

  private topPlayers: Player[] = [];

  private months: string[] = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai',
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private quizService: QuizService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadTheme();
    this.updateCalendar();
  }

  ngOnInit() {
    this.isLoading = true;

    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth > 768;
    });

    if (this.isBrowser) {
      this.username = localStorage.getItem('username') || 'Guest';
      this.email = localStorage.getItem('email') || 'Guest';
      const token = localStorage.getItem('accessToken');
      this.isDarkMode = localStorage.getItem('theme') !== 'light';
      if (!token) {
        this.router.navigate(['/home']);
        return;
      }
      this.applyTheme();
      this.fetchTopPlayers(); // Gọi hàm lấy top players
      this.fetchRecentQuizzes();
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  private fetchTopPlayers() {
    const levels = ['mix', 'easy', 'medium', 'hard'];
    const token = localStorage.getItem('accessToken') || '';
    let allPlayers: Player[] = [];

    // Gọi API cho từng level
    const requests = levels.map((level) =>
      this.http.get<any>(`http://localhost:8000/api/play/leaderboard/${level}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    );

    // Chờ tất cả các request hoàn thành
    Promise.all(requests.map((req, index) =>
      req.toPromise().then((res: any) => {
        return res.map((player: any) => ({
          idUser: player.idUser,
          totalScore: player.totalScore,
          username: player.username || player.email,
          email: player.email,
          duration: player.duration || '00:00:00',
          level: levels[index], // Gán level tương ứng
        }));
      }).catch((err) => {
        console.error(`Lỗi khi lấy xếp hạng ${levels[index]}:`, err);
        return [];
      })
    )).then((results) => {
      // Gộp tất cả players từ các level
      allPlayers = results.flat();
      // Sắp xếp theo totalScore và duration, lấy top 4
      this.topPlayers = allPlayers
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          return this.parseDuration(a.duration) - this.parseDuration(b.duration);
        })
        .slice(0, 4);

      // Cập nhật dữ liệu biểu đồ
      this.updateChartData();
    });
  }

  // Hàm chuyển duration (HH:mm:ss) thành giây để so sánh
  private parseDuration(duration: string): number {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  private updateChartData() {
    this.barChartData.labels = this.topPlayers.map((player) => player.username);
    this.barChartData.datasets[0].data = this.topPlayers.map((player) => player.totalScore);
  }

  private fetchRecentQuizzes() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.quizService.getAllPlayerResults().subscribe({
      next: (res: any[]) => {
        this.recentAttempts = res
          .filter((item) => String(item.idUser) === String(userId))
          .map((item) => ({
            quizLevel: item.results?.[0]?.quizLevel || 'Unknown',
            totalScore: item.totalScore || 0,
            dateDoQuiz: item.dateDoQuiz || new Date().toISOString(),
          }))
          .sort((a, b) => new Date(b.dateDoQuiz).getTime() - new Date(a.dateDoQuiz).getTime())
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách quiz:', err);
        this.recentAttempts = [];
      },
    });
  }

  private loadTheme() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
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

    for (let i = 1; i <= daysInMonth; i++) {
      this.daysInMonth.push(i);
    }
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentMonthIndex === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
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

  onLogout() {
    this.http.post('http://localhost:8000/api/auth/logout', {}).subscribe({
      next: () => {
        if (this.isBrowser) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('username');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('email');
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
      },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
