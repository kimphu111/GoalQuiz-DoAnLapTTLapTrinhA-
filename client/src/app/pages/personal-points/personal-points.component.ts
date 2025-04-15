import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-points',
  standalone: true,
  imports: [],
  templateUrl: './personal-points.component.html',
  styleUrl: './personal-points.component.scss'
})
export class PersonalPointsComponent {
  username: string = '';
  email: string = '';
}
