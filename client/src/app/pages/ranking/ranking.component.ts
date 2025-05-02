import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent implements OnInit {
  currentLevel: string = 'mixed'; // Mức độ mặc định
  currentPlayers: { name: string; score: number,mode:string }[] = [];

  levels: { [key: string]: { name: string; score: number,mode : string }[] } = {
    easy: [
      { name: 'Adam!', score: 100,mode: 'easy' },
      { name: 'Justin', score: 90,mode: 'easy' },
      { name: 'Memo!', score: 80,mode: 'easy'},
      { name: 'Titanium', score: 70,mode: 'easy' },
      { name: 'Milo', score: 60,mode: 'easy' },
    ],
    medium: [
      { name: 'Alice', score: 150,mode: 'medium' },
      { name: 'Bob', score: 140,mode: 'medium' },
      { name: 'Charlie', score: 130,mode: 'medium' },
      { name: 'Dave', score: 120,mode: 'medium' },
      { name: 'Liam', score: 50,mode: 'medium' },

    ],
    hard: [
      { name: 'Eve', score: 200, mode: 'hard' },
      { name: 'Frank', score: 190, mode: 'hard' },
      { name: 'Grace', score: 180, mode: 'hard' },
      { name: 'Heidi', score: 170, mode: 'hard' },
      { name: 'Ivan', score: 160, mode: 'hard' },
    ],
    mixed: [
      { name: 'Johnie!', score: 170, mode: 'mixed' },
      { name: 'Enzo', score: 160, mode: 'mixed' },
      { name: 'Maloch!', score: 140, mode: 'mixed' },
      { name: 'Billow', score: 130, mode: 'mixed' },
      { name: 'Teddy', score: 120, mode: 'mixed' },

    ],
  };

  constructor() {}

  ngOnInit(): void {
    this.selectLevel(this.currentLevel); // Khởi tạo với mức độ mặc định
  }

  selectLevel(level: string): void {
    this.currentLevel = level;
    this.currentPlayers = this.levels[level];
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
