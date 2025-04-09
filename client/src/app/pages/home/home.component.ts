import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  username: string = '';
  quizzes = [
    {
      id: 1,
      title: 'Premier League Trivia',
      description: 'Test your knowledge about the English Premier League!',
      image: 'assets/premier-league.jpg'
    },
    {
      id: 2,
      title: 'World Cup History',
      description: 'How well do you know the FIFA World Cup?',
      image: 'assets/world-cup.jpg'
    },
    {
      id: 3,
      title: 'Football Legends',
      description: 'Guess the iconic players of all time!',
      image: 'assets/football-legends.jpg'
    }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'Guest';

    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Giả sử backend trả username trong token payload
        const decoded: any = JSON.parse(atob(token.split('.')[1])); // Decode token thủ công
        this.username = decoded.username || 'Guest';
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  startQuiz(quizId: number) {
    // Điều hướng đến trang quiz cụ thể (có thể thêm route sau)
    console.log('Start quiz:', quizId);
    this.router.navigate([`/quiz/${quizId}`]);
  }

  onLogout() {
    // Gọi API logout nếu backend có (tùy chọn)
    this.http.post('http://localhost:3000/api/auth/logout', {}).subscribe({
      next: () => {
        // Xóa token và role khỏi localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username'); // Xóa username nếu có
        localStorage.removeItem('refreshToken'); // Xóa refresh token nếu có
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Vẫn xóa token và điều hướng nếu API lỗi
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/auth']);
      }
    });
  }
}