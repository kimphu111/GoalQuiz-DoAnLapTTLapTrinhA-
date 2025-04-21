import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GoalQuiz';
}

//chay current o day de luu du lieu ng dung luu accesstoken ( khi nao can thi lay accesstoken de lay tt ng dung ra chu k luu tru)


