import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss'
})
export class AdminNavbarComponent {

}
