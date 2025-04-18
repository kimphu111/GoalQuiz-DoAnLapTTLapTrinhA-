import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-album-quiz',
  standalone: true,
  imports: [NgIf, RouterLink, CommonModule ],
  templateUrl: './album-quiz.component.html',
  styleUrl: './album-quiz.component.scss'
})
export class AlbumQuizComponent {

  constructor(private location: Location,
              private router: Router
  ){}

  isPopupVisible: boolean = false;
  popupLevel: string = '';

  openPopup(level: string): void{
    this.isPopupVisible = true;
    this.popupLevel = level;

  }

  closePopup(): void{
    this.isPopupVisible = false;
    this.popupLevel = '';
  }

  goBack(): void{
    this.location.back();
  }

  navigateToQuiz(level: string): void {
    this.closePopup();
    if (level === 'mixed') {
      // Pass a special flag for mixed, or handle in quiz-question.component.ts
      this.router.navigate(['/quiz-question'], { queryParams: { level: 'mixed' } });
    } else {
      this.router.navigate(['/quiz-question'], { queryParams: { level } });
    }
  }
}
