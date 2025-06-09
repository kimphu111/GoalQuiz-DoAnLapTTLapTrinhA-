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
  currentLevel: string = 'mixed'; // Mức độ mặc định
  currentPlayers: {
    idUser: string;
    totalScore: number;
    username: string;
    email: string;
  }[] = [];
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.selectLevel(this.currentLevel); // Khởi tạo với mức độ mặc định
  }

  selectLevel(level: string): void {
    this.currentLevel = level;
    this.isLoading = true;

    const token = localStorage.getItem('accessToken') || '';
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
          // Định dạng lại dữ liệu để khớp với template
          this.currentPlayers = res.map((player: any) => ({
            idUser: player.idUser,
            totalScore: player.totalScore,
            username: player.username || player.email, // Dùng username hoặc email nếu username không có
            email: player.email,
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Lỗi khi lấy xếp hạng:', err);
          this.currentPlayers = [];
          this.isLoading = false;
        },
      });
  }

  getRankClass(index: number): string {
    switch (index) {
      case 0:
        return 'rank-1';
      case 1:
        return 'rank-2';
      case 2:
        return 'rank-3';
      case 3:
        return 'rank-4';
      default:
        return 'rank-default';
    }
  }
}
