import {Component, OnInit} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    NgClass,CommonModule
  ],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit {
  players = [
    { name: 'Johnie!', score: 170 },
    { name: 'Enzo', score: 160 },
    { name: 'Maloch!', score: 140 },
    { name: 'Billow', score: 130 },
  ];

  constructor() {}

  ngOnInit(): void {}

  getRankClass(index: number): string {
    switch (index) {
      case 0:
        return 'rank-1';
      case 1:
        return 'rank-2';
      case 2:
        return 'rank-3';
      default:
        return 'rank-default';
    }
  }
}
