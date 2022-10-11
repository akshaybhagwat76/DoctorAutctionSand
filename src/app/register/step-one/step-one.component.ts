import { Component, OnInit,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from 'src/app/shared/services';
import { RegisterService } from 'src/app/shared/services/register.service';
import { UrlService } from 'src/app/shared/services/url.service';
declare let $: any;
@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent implements OnInit {

  state = [
    { id: 26, name: 'Maharashtra' }
  ];

  cities = [
    { id: 1, name: 'Mumbai' }
  ];

  country = [
    { id: 1, name: 'India' }
  ];

  stepOneForm: any;

  dial_code = [
    { code: '91', name: '+91' }
  ];

  address_proof:any;
  stateList: any;
  cityList: any;
  postData: boolean = true;
  // fileSelected:boolean=false;
  memorandumUrl = "https://www.doctorsand.com/MOU/Doctor_Sand_Seller_MOU.pdf";
  role_id = 2;
  posted_address_ext = "pdf";
  posted_address_url ="";
  ischecked = false;
  policy_check_error = "";
  address_error = "";
  constructor(
    private el: ElementRef,private route:ActivatedRoute, private registerService: RegisterService,
      private _listingService: ListingService,
      private _router :Router,
    private fb: FormBuilder, public urlService: UrlService) { }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    this.verifyToken(token);
    this.getStateList();
  }
  getStateList(){
    this._listingService.getStateList("1")
        .subscribe(success=>{
          this.stateList = success.result;
        },error =>{

        });
  }

  getCityList(id:any){
    this._listingService.getCityListing(id)
        .subscribe(success=>{
          this.cityList = success.result;
        },  error=>{

        })
  } 

  verifyToken(token: any) {
    this.registerService.validateToken({token: token}).subscribe(
      (success) => {
        if(success.success) {
          if(success.result.registration_status >= 50){
            $('#reg-succ-modal').modal({
              backdrop: 'static',
              keyboard: false
            });
            $('#reg-succ-modal').modal('show');
          }else{
            if(success.result.address_proof){
            this.postData = false;
            }
            this.initForm(success.result);
            this.getCityList(success.result.state_id);
  
            localStorage.setItem('doctor-sand-user', JSON.stringify(success.result));
            this.role_id = success.result.role_id;
            this.memorandumUrl = success.result.mou_link;
            // if(success.result.role_id ==2){
            //   this.memorandumUrl = "https://www.doctorsand.com/MOU/Doctor_Sand_Seller_MOU.pdf";
            // }else{
            //   this.memorandumUrl = "https://www.doctorsand.com/MOU/Doctor_Sand_Buyer_MOU.pdf";
            // }
            // console.log(success.result.role_id);
          }
        }
        // console.log(success);
      },
      error=>{
        console.log(error);
      })
  }

  initForm(data: any) {
    // data.tin_numer = '98765432101';
    // data.cin_number = 'a45865as5864swd565586';
    // data.tan_number = 'edwa54685a';
    // // data.account_holder_name = 'test';
    // data.bank_name = 'test';
    // data.ifsc_code = 'test';
    // data.account_number = 'test';
    // if(data.registration_status == "Payment Completed"){
    //   $('#reg-succ-modal').modal({
    //     backdrop: 'static',
    //     keyboard: false
    //   });
    //   $('#reg-succ-modal').modal('show');
    // }else
    // {
      
    // }
    if(data && data.address_proof){
      this.ischecked = true;
      this.posted_address_ext = data.address_proof.split('.').pop();
      console.log(this.posted_address_ext);
      this.posted_address_url = 'user_'+data.user_id+'/'+data.address_proof;
    }
    this.stepOneForm = this.fb.group({
      user_id: [data.user_id, Validators.required],
      role_id: new FormControl({value: data.role_id, disabled: true}, Validators.required),
      name: new FormControl({value: data.name, disabled: true}, Validators.required),
      address_line_1: new FormControl({value: data.line_1, disabled: true}, Validators.required),
      landmark: new FormControl({value: data.landmark, disabled: true}, Validators.required),
      state_id: new FormControl({value: data.state_id, disabled: true}, Validators.required),
      city_id: new FormControl({value: data.city_id, disabled: true}, Validators.required),
      country_id: new FormControl({value: data.country_id, disabled: true}, Validators.required),
      pincode: new FormControl({value: data.pincode, disabled: true}, Validators.required),
      pan_number: new FormControl({value: data.pan_number, disabled: true}, Validators.required),
      gst_number: new FormControl({value: data.gst_number, disabled: true}, Validators.required),
      dial_code: new FormControl({value: '91', disabled: true}, Validators.required),
      mobile: new FormControl({value: data.mobile, disabled: true}, Validators.required),
      email: new FormControl({value: data.email, disabled: true}, Validators.required),
      tin_number: new FormControl({value: data.tin_number =='-' ? "": data.tin_number, disabled: data.tin_number ? true : false}, [Validators.minLength(11), Validators.maxLength(11),Validators.pattern('[0-9]{11}')]),
      cin_number: new FormControl ({value:data.cin_number =='-'?"":data.cin_number, disabled : data.cin_number ? true : false}, [Validators.minLength(21), Validators.maxLength(21),Validators.pattern('[A-Za-z]{1}[0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}')]),
      tan_number: new FormControl({value : data.tan_number == '-'?"":data.tan_number,disabled : data.tan_number ? true : false}, [Validators.minLength(10), Validators.maxLength(10),Validators.pattern('[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}')]),
      address_proof: new FormControl({value: data.address_proof,disabled : data.address_proof ? true : false }, Validators.required),
      // account_holder_name: new FormControl({value: data.account_holder_name, disabled: data.account_holder_name ? true : false}, Validators.required),
      bank_name: new FormControl({value: data.bank_name, disabled: data.bank_name ? true : false}),
      ifsc_code: new FormControl({value: data.ifsc_code, disabled: data.ifsc_code ? true : false}, Validators.pattern('[A-Za-z]{4}[A-Za-z0-9]{7}')),
      account_number: new FormControl({value: data.account_number, disabled: data.account_number ? true : false}),
      confirm_account_number: new FormControl({value: data.account_number, disabled: data.account_number ? true : false})

  
    });
  }

  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.stepOneForm.controls['address_proof'] = file;
    this.address_proof = file;
    this.address_error = "";
    // this.fileSelected = true;
    // console.log(this.form.controls[i].controls['poc_profile'].value);
  }

  // removeFile(){
  //   this.stepOneForm.controls['address_proof'].value = "";
  //   this.address_proof = null;
  //   this.fileSelected = false;
  // }
  submitStepOne() {

    if(!this.postData){
      this._router.navigateByUrl('/register/step-two');
      return;
    }
    let invalidControl;
    if(this.stepOneForm.invalid){
      // this.stepOneForm = true;
      this.stepOneForm.touched = true;
      this.policy_check_error = "Please enter all mandatory fields before proceeding.";
      setTimeout(() => {
        this.policy_check_error = "";
      }, 5000);
      return;
    }
    let acc_number = this.stepOneForm.get('account_number').value;
    let cfm_acc_number = this.stepOneForm.get('confirm_account_number').value;
    if (acc_number != cfm_acc_number) {
      invalidControl = this.el.nativeElement.querySelector('[formcontrolname="confirm_account_number"]');
      invalidControl.focus();
      return
    }
    if (!$('#understandingCheck').is(':checked')) {
      this.policy_check_error = "Please read and accept Memorandum of understanding";
      setTimeout(() => {
        this.policy_check_error = "";
      }, 5000);
      return;
    }
    let formData = new FormData();
    formData.append('tin_number',this.stepOneForm.controls['tin_number'].value ? this.stepOneForm.controls['tin_number'].value : "-");
    formData.append('cin_number',this.stepOneForm.controls['cin_number'].value ? this.stepOneForm.controls['cin_number'].value : "-");
    formData.append('tan_number',this.stepOneForm.controls['tan_number'].value ? this.stepOneForm.controls['tan_number'].value : "-");
    formData.append('address_proof',this.address_proof);
    // formData.append('account_holder_name',this.stepOneForm.controls['account_holder_name'].value);
    formData.append('bank_name',this.stepOneForm.controls['bank_name'].value ? this.stepOneForm.controls['bank_name'].value : '-');
    formData.append('ifsc_code',this.stepOneForm.controls['ifsc_code'].value ? this.stepOneForm.controls['ifsc_code'].value : '-');
    formData.append('account_number',this.stepOneForm.controls['account_number'].value ? this.stepOneForm.controls['account_number'].value : '-');

    // let formData = {
    //   tin_number: this.stepOneForm.controls['tin_number'].value,
    //   cin_number: this.stepOneForm.controls['cin_number'].value,
    //   tan_number: this.stepOneForm.controls['tan_number'].value,
    //   address_proof: this.address_proof,
    //   // account_holder_name: this.stepOneForm.controls['account_holder_name'].value,
    //   bank_name: this.stepOneForm.controls['bank_name'].value,
    //   ifsc_code: this.stepOneForm.controls['ifsc_code'].value,
    //   account_number: this.stepOneForm.controls['account_number'].value
    // };


    this.registerService.submitStepOne(formData).subscribe(
      (success) => {
        if(success.success) {
          this._router.navigateByUrl('/register/step-two');
        }else{
          if(success.error && success.error.message && success.error.message.address_proof){
            this.address_error = success.error.message.address_proof[0];
          }
        }
        console.log(success);
        
      },
      (fail) => {
        console.log(fail);
      }
    );
  }
  gotoHome(){
    window.location.href = "https://www.doctorsand.com/";
  }

}
