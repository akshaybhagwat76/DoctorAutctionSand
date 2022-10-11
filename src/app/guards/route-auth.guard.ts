import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (
      !this.authService.isAuthenticated()
      //  ||
      // !this.authService.isAdminUser()
    ) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}

@Injectable()
export class NonAuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.isAdminUser()) {
      this.router.navigate(['/admin']);
      return false;
    }
    return true;
  }
}
