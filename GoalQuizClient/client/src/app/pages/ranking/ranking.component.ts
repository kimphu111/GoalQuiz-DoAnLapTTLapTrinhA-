import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent implements OnInit {
  currentLevel: string = 'mix';
  currentPlayers: {
    idUser: string;
    totalScore: number;
    username: string;
    email: string;
    duration: string; // Thay quizDuration bằng duration kiểu string
  }[] = [];
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.selectLevel(this.currentLevel);
  }

  selectLevel(level: string): void {
    this.currentLevel = level;
    this.isLoading = true;

    const token = localStorage.getItem('accessToken') || '';
    const localKey = `latestQuizResult_${level}`;
    const localResults = JSON.parse(localStorage.getItem(localKey) || '[]');

    this.http
      .get<any>(`http://localhost:8000/api/play/leaderboard/${level}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (res) => {
          console.log('Ranking data:', res);

          this.currentPlayers = res.map((player: any) => ({
            idUser: player.idUser,
            totalScore: player.totalScore,
            username: player.username || player.email,
            email: player.email,
            duration: player.duration || '00:00:00', // Sử dụng duration từ API, dự phòng nếu không có
          })).sort((a: { totalScore: number; duration: string }, b: { totalScore: number; duration: string }) => {
            if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
            // So sánh duration dưới dạng giây nếu cần
            return this.parseDuration(a.duration) - this.parseDuration(b.duration);
          });

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Lỗi khi lấy xếp hạng:', err);
          this.currentPlayers = [];
          this.isLoading = false;
        },
      });
  }

  // Hàm chuyển duration (HH:mm:ss) thành giây để so sánh
  private parseDuration(duration: string): number {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  getRankClass(index: number): string {
    switch (index) {
      case 0: return 'rank-1';
      case 1: return 'rank-2';
      case 2: return 'rank-3';
      case 3: return 'rank-4';
      default: return 'rank-default';
    }
  }
}
