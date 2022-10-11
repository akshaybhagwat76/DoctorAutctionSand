import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  profileData: any;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.profileData = this.authService.profileData();
  }

  handleLogout(e: any) {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

}
