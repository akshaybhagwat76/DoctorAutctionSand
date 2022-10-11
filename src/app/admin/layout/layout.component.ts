import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  profileData: any;
  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.profileData = this.authService.profileData();
  }

  handleLogout(e: any) {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
