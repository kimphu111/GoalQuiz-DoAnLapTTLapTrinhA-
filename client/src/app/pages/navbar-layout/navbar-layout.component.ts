import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './navbar-layout.component.html',
  styleUrls: ['./navbar-layout.component.scss'],
  imports: [
    NgClass,
    RouterLink,
    RouterOutlet
  ],
  standalone: true
})
export class navbarLayoutComponent {
  username: string = ''; // Thay bằng dữ liệu thực tế, ví dụ từ service
  isDarkMode: boolean = true;
  isSidebarVisible: boolean = true;


  constructor(private router: Router) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    // Logic để lưu theme nếu cần (localStorage, service, v.v.)
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onLogout() {
    // Logic đăng xuất
    this.router.navigate(['/login']);
  }
}
