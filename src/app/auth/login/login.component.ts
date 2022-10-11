import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LOCALSTORAGE_USER,
  ROLE_ID_ADMIN,
  ROLE_ID_RETAILER,
  ROLE_ID_BUYER
} from 'src/app/shared/constants';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loginFormError: string = '';
  forgetPassword: boolean = false;
  forgetPassForm: any;
  forgetPassErrorMessage = '';
  forgetPassSuccessMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          // Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}'),
        ],
      ],
      password: [null, [Validators.required]],
    });
  }

  initForgetPasswordMail() {
    this.forgetPassword = true;
    this.forgetPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onForgetPassSubmit() {
    this.forgetPassSuccessMessage = '';
    this.forgetPassErrorMessage = '';
    if(!this.forgetPassForm.valid) {
      this.forgetPassForm.markAllAsTouched();
      return;
    }
    this.authService.forgetPassword(this.forgetPassForm.value).subscribe(
      (res: any) => {
        // TODO: Revert this condition to handle actual api response;
        if (!res.success) {
          this.forgetPassForm.reset();
          this.forgetPassErrorMessage = res.error.message;
        } else {
          this.forgetPassSuccessMessage = res.error.message;
          // this.forgetPassword = false;
        }
    });
  }

  login() {
    this.authService.authenticate(this.loginForm.value).subscribe(
      (res: any) => {
        // TODO: Revert this condition to handle actual api response;
        if (!res.success) {
          this.loginForm.reset();
          this.loginFormError = 'User data not found';
        } else {
          this.loginFormError = '';
          localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(res.result));
          if (res.result.role_id === ROLE_ID_ADMIN) {
            this.router.navigateByUrl('/admin');
          } else if (res.result.role_id === ROLE_ID_RETAILER) {
            this.router.navigateByUrl('/retailer');
          } else if (res.result.role_id === ROLE_ID_BUYER){
            console.log(res.result.role_id);
            this.router.navigateByUrl('/user');
          }else {
            this.router.navigateByUrl('/register');
          }
        }
      },
      (err: any) => {
        this.loginForm.reset();
        this.loginFormError = 'Oops! Please try after sometime!';
      }
    );
  }
}
