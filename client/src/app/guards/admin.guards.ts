import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!isPlatformBrowser(this.platformId)) {
    // Nếu không phải trình duyệt, không cho phép
    return false;
  }
    const role = localStorage.getItem('role');
    
    if (role === 'admin') {
      return true;
    } else {
      alert('Bạn không có quyền truy cập vào trang này');
      this.router.navigate(['/home']);
      return false;
    }
  }
}
