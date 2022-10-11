import { Component, OnInit, ElementRef } from '@angular/core';
// import { $ } from 'protractor';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ListingService,
  RegisterService
} from "./../shared/services/index"

// import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { UrlService } from '../shared/services/url.service';

declare let $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regToken = '';
  registerForm: any;

  country = [{ id:1, name:'India'}];
  dial_code = [ { code: 91, name: '+91' } ];

  phone_otp_sent = false;
  email_otp_sent = false;

  verified_mobile: any = 0;
  verified_email: any = 0;
  otp_error_mobile = 'OTP has been sent to mobile number';
  otp_error_email = "OTP has been sent to your email";
  otp_invalid_mobile = "";
  otp_invalid_email = "";
  stateList: any;
  cityList: any;
  otpResp: any;
  otpRespMobile: any;
  mobileExists: boolean = false;
  otpRespEmail: any;

  showResendPhone = false;
  showResendEmail = false;

  otpCountDownPhone = '';
  otpCountDownEmail = '';

  showPass = false;
  showCnfPass = false;
  emailExists: boolean = false;
  policy_check_error = "";
  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private _listingService : ListingService,
    private registerService: RegisterService,
    private urlService: UrlService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadStateList();
  }

  loadStateList(){
    this._listingService.getStateList("1")
        .subscribe(success=>{
          this.stateList = success.result;
        },error=>{
          console.log(error);
        })
  }

  loadCityList(state_id:any){
    this._listingService.getCityListing(state_id)
        .subscribe(success =>{
          this.cityList = success.result;
        },error=>{
          console.log(error);
        })
  }
  initForm() {
    this.registerForm = this.fb.group({
      role_id: [2, [Validators.required]],
      name: [null, [Validators.required]],
      address_line_1: [null, [Validators.required]],
      address_line_2: [null],
      landmark: [null],
      state_id: [null, [Validators.required]],
      city_id: [null, [Validators.required]],
      country_id: [1, [Validators.required]],
      pincode: [null, [Validators.required,Validators.pattern('[0-9]{6}')]],
      pan_number: [null, [Validators.required,Validators.pattern('[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}')]],
      gst_number: [null, [Validators.required,Validators.pattern('[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[0-9]{1}[A-Za-z]{1}[0-9A-Za-z]{1}')]],
      dial_code: [91, [Validators.required]],
      mobile: [null, [Validators.required,Validators.pattern('[0-9]{10}')]],
      phone_otp: [null],
      email: [null, [Validators.required,Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}")]],
      email_otp: [null],
      password: [null, [Validators.required]],
      confirm_password: [null, [Validators.required]]
    });
  }

  sendOtp(to: any) {
    let dial_code = this.registerForm.get('dial_code').value;
    let mobile = this.registerForm.get('mobile').value;
    let email = this.registerForm.get('email').value;
    if (to == 'phone') {
      if (dial_code && mobile) {
        if(!this.registerForm.controls.mobile.valid){
          return;
        }
        // this.phone_otp_sent = true;
        this.registerService.sendPhoneOtp({ mobile: mobile }).subscribe(
          (success) => {
            this.phone_otp_sent = true;
            console.log(success);
            if(!success.success){
              this.mobileExists = true;
              this.phone_otp_sent = false;
              setTimeout(()=>{ this.mobileExists = false},6000);
            } else {
              this.startCountDownMobile();
            }
            this.otpRespMobile = success.result;

            // setTimeout(()=>{
            //   if(!this.showResendPhone){
            //     this.showResendPhone = true;
            //   }
            // },30000);
          },
          (fail) => {
            this.phone_otp_sent = false;
            console.log(fail);
          }
        );
      } else {
        let invalidControl = this.el.nativeElement.querySelector('[formcontrolname="dial_code"]');
        invalidControl.focus();
        invalidControl = this.el.nativeElement.querySelector('[formcontrolname="mobile"]');
        invalidControl.focus();
        this.phone_otp_sent = false;
      }

    } else if (to == 'email') {
      if (email) {
        if(!this.registerForm.controls.email.valid){
          return;
        }
        // this.email_otp_sent = true;
        this.registerService.sendEmailOtp({ email: email }).subscribe(
          (success) => {
            this.email_otp_sent = true;
            this.otpRespEmail = success.result;
            if(!success.success){
              this.emailExists = true;
              this.email_otp_sent = false;
              setTimeout(()=>{ this.emailExists = false},6000);
            } else {
              this.startCountDownEmail();
            }
            // setTimeout(()=>{
            //   if(!this.showResendEmail){
            //     this.showResendEmail = true;
            //   }
            // },30000);
            console.log(success);
          },
          (fail) => {
            this.email_otp_sent = false;
            console.log(fail);
          }
        );
      } else {
        let invalidControl = this.el.nativeElement.querySelector('[formcontrolname="email"]');
        invalidControl.focus();
        this.email_otp_sent = false;
      }
    }
  }

  startCountDownMobile() {
    this.showResendPhone = false;
    let ts = 120;
    let m = 1;
    let s = 59;
    this.otpCountDownPhone = '02:00';
    let intervalMobile = setInterval(() => {
      if(s == 0) {
        m = 0;
        s = 60;
      }
      this.otpCountDownPhone = '0'+m+':'+(s<10?'0':'')+s;
      --s;
      --ts;
      if(ts < 1) {
        this.otpCountDownPhone = '';
        this.showResendPhone = true;
        clearInterval(intervalMobile);
      }
    }, 1000);
  }
  
  startCountDownEmail() {
    this.showResendEmail = false;
    this.otpCountDownEmail = '02:00';
    let ts1 = 120;
    let m1 = 1;
    let s1 = 59;
    let intervalEmail = setInterval(() => {
      if(s1 == 0) {
        m1 = 0;
        s1 = 60;
      }
      this.otpCountDownEmail = '0'+m1+':'+(s1<10?'0':'')+s1;
      --s1;
      --ts1;
      if(ts1 < 1) {
        this.otpCountDownEmail = '';
        this.showResendEmail = true;
        clearInterval(intervalEmail);
      }
    }, 1000);
  }

  verify_otp(type: any) {
    let dial_code = this.registerForm.get('dial_code').value;
    let mobile = this.registerForm.get('mobile').value;
    let email = this.registerForm.get('email').value;
    let phone_otp = this.registerForm.get('phone_otp').value;
    let email_otp = this.registerForm.get('email_otp').value;
    if (type == 1) {
      if (!mobile || !phone_otp) {
        return;
      }
      let postData = {
        mobile: mobile,
        otp_type: 1,
        otp: phone_otp
      };
      this.registerService.verifyOtp(postData).subscribe(
        (success) => {
          this.verified_mobile = mobile;
          console.log(success);
          if(!success.success){
            this.verified_mobile = 0;
            // this.otp_error_mobile = success.error.message;
            this.otp_invalid_mobile = success.error.message;
          }
        },
        (fail) => {
          this.verified_mobile = 0;
          // this.otp_error_mobile = 'Incorrect OTP';
          this.otp_invalid_mobile = 'Invalid OTP';
          console.log(fail);
        }
      );
    } else if (type == 2) {
      if (!email || !email_otp) {
        return;
      }
      let postData = {
        email: email,
        otp_type: 2,
        otp: email_otp
      };
      this.registerService.verifyOtp(postData).subscribe(
        (success) => {
          this.verified_email = email;
          console.log(success);
          if(!success.success){
            this.verified_email = 0;
            // this.otp_error_email = success.error.message;
            this.otp_invalid_email = success.error.message;
          }
        },
        (fail) => {
          this.verified_email = 0;
          // this.otp_error_email = 'Incorrect OTP';
          this.otp_invalid_email = 'Invalid OTP';
          console.log(fail);
        }
      );
    }
  }


  register() {
    let dial_code = this.registerForm.get('dial_code').value;
    let mobile = this.registerForm.get('mobile').value;
    let email = this.registerForm.get('email').value;
    let invalidControl;
    if (mobile != this.verified_mobile) {
      this.verified_mobile = '';
      invalidControl = this.el.nativeElement.querySelector('[formcontrolname="dial_code"]');
      invalidControl.focus();
      invalidControl = this.el.nativeElement.querySelector('[formcontrolname="mobile"]');
      invalidControl.focus();
      this.phone_otp_sent = false;
      return;
    }
    if (email != this.verified_email) {
      this.verified_email = '';
      invalidControl = this.el.nativeElement.querySelector('[formcontrolname="email"]');
      invalidControl.focus();
      this.email_otp_sent = false;
      return;
    }
    let password = this.registerForm.get('password').value;
    let cfm_password = this.registerForm.get('confirm_password').value;
    if (password != cfm_password) {
      invalidControl = this.el.nativeElement.querySelector('[formcontrolname="confirm_password"]');
      invalidControl.focus();
      return
    }
    if (!$('#policyCheck').is(':checked')) {
      this.policy_check_error = "Please read and accept terms & conditions";
      setTimeout(() => {
        this.policy_check_error ="";
      }, 5000);
      return;
    }
    // $('#reg-succ-modal').modal({
    //   backdrop: 'static',
    //   keyboard: false
    // });
    // $('#reg-succ-modal').modal('show');
    this.registerService.register(this.registerForm.value).subscribe(
      (success) => {
        this.regToken = success.result.reg_link;
        $('#reg-succ-modal').modal({
          backdrop: 'static',
          keyboard: false
        });
        $('#reg-succ-modal').modal('show');
        console.log(success);
      },
      (fail) => {
        console.log(fail);
      }
    );
  }

  setRole(role : number){
    this.registerForm.controls['role_id'].setValue(role);
  }
  gotoHome(){
    window.location.href = "https://www.doctorsand.com/";
  }
}
