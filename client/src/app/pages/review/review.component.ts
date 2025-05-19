import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  latestEasy: any = {};
  latestMix: any = {};
  latestMedium: any = {};
  latestHard: any = {};

  ngOnInit(): void {
    this.latestEasy = JSON.parse(localStorage.getItem('latestQuizResult_easy') || '{}');
    this.latestMedium = JSON.parse(localStorage.getItem('latestQuizResult_medium') || '{}');
    this.latestHard = JSON.parse(localStorage.getItem('latestQuizResult_hard') || '{}');
    this.latestMix = JSON.parse(localStorage.getItem('latestQuizResult_mix') || '{}');
  }
}
