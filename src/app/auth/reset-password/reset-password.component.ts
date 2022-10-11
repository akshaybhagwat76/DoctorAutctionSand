import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from 'src/app/shared/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: any;
  validUser: boolean = true;
  token: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private registerService: RegisterService,
    private toastService: ToastService
    ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.params.token;
    this.verifyToken(this.token);
  }

  initForm() {
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  }

  onResetPassSubmit() {
    if(!this.form.valid || this.form.value.password !== this.form.value.confirm_password) {
      this.form.controls.confirm_password.touched = true;
      this.form.markAllAsTouched();
      return;
    }
    this.authService.changePassword(this.form.value).subscribe(
      (res: any) => {
        // TODO: Revert this condition to handle actual api response;

        if (!res.success) {
          this.form.reset();
          this.showDanger(res.error.message);
        } else {
          this.showSuccess(res.error.message);
          setTimeout(() => {
            this.router.navigate(['/auth']);
          }, 1000);
        }
    });
  }

  verifyToken(token: any) {
    this.registerService.validateToken({token: token}).subscribe(
      (success) => {
        if(success.success) {
          localStorage.setItem('doctor-sand-user', JSON.stringify(success.result));
          this.validUser = true;
          this.initForm();
        } else {
          this.validUser = false;
        }
      },
      error=>{
        console.log(error);
        this.validUser = false;
      });
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
