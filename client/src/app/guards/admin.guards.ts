import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('AdminGuard: isAuthenticated =', isAuthenticated);
    if (!isAuthenticated) {
      if (isPlatformBrowser(this.platformId)) {
        this.snackBar.open('Vui lòng đăng nhập để tiếp tục', 'Đóng', {
          duration: 3000,
        });
      }
      console.log('AdminGuard: Redirecting to /auth');
      this.router.navigate(['/auth']);
      return false;
    }

    const role = this.authService.getRole();
    console.log('AdminGuard: role =', role);
    if (role === 'admin') {
      return true;
    } else {
      if (isPlatformBrowser(this.platformId)) {
        this.snackBar.open(
          'Bạn không có quyền truy cập vào trang này',
          'Đóng',
          { duration: 3000 },
        );
      }
      console.log('AdminGuard: Redirecting to /home');
      this.router.navigate(['/home']);
      return false;
    }
  }
}
