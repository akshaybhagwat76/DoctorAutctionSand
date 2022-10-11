import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

// Service
import { ListingService, RegisterService } from 'src/app/shared/services';
import { UrlService } from 'src/app/shared/services/url.service';
import { UserService } from 'src/app/shared/services/user.service';

declare let $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  auctionId: any = '';
  stateList: any;
  cityList: any;
  addressList: any[] = [];
  dial_code = [
    { code: '91', name: '+91' }
  ];

  addressForm: any;
  user: any;
  constructor(
    private _listingService: ListingService,
    private fb: FormBuilder,
    public _registerService: RegisterService,
    private _userService: UserService,
    public urlService: UrlService
  ) { }

  ngOnInit(): void {
    this.getAddressList();
    this.getStateList();
    this.initForm();
    this.user = localStorage.getItem('doctor-sand-user');
    this.user = JSON.parse(this.user);
    this.addressForm.controls['user_id'].setValue(this.user.user_id);
  }

  initForm() {
    this.addressForm = this.fb.group({
      user_id: ['', Validators.required],
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      city_id: ['', Validators.required],
      state_id: ['', Validators.required],
      pincode: ['', Validators.required],
      poc_profile: ['', Validators.required],
      poc_name: ['', Validators.required],
      poc_email: ['', Validators.required],
      poc_mobile: ['', Validators.required],
      dial_code: new FormControl({value: '91', disabled: true}, Validators.required)
    });
  }

  getAddressList(){
    this._userService.getUserAddressList()
        .subscribe(success=>{
          this.addressList = success.result;
        },  error=>{
          this.addressList = [];
        })
  }

  getStateList(){
    this._listingService.getStateList("1")
        .subscribe(success=>{
          this.stateList = success.result;
        },error =>{
          this.stateList = [];
        });
  }
  getCityList(){
    this._listingService.getCityListing(this.addressForm.value.state_id)
        .subscribe(success=>{
          this.cityList = success.result;
        },  error=>{
          this.cityList = [];
        })
  }

  submitAddressForm() {
    if(this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    let formData = new FormData();
    formData.append('user_id',this.addressForm.controls['user_id'].value);
    formData.append('address[]',this.addressForm.controls['address'].value);
    formData.append('landmark[]',this.addressForm.controls['landmark'].value);
    formData.append('city_id[]',this.addressForm.controls['city_id'].value);
    formData.append('state_id[]',this.addressForm.controls['state_id'].value);
    formData.append('pincode[]',this.addressForm.controls['pincode'].value);
    formData.append('poc_profile[]',this.addressForm.controls['poc_profile']);
    formData.append('poc_name[]',this.addressForm.controls['poc_name'].value);
    formData.append('poc_email[]',this.addressForm.controls['poc_email'].value);
    formData.append('poc_mobile[]',this.addressForm.controls['poc_mobile'].value);

    this._registerService.update_poc_details(formData).subscribe(
      (success) => {
        console.log(success);
        // document.getElementById('modal-close-btn')?.click();
        if(success.success) {
          this.initForm();
          $('#OCFormModal').modal("toggle");
          this.getAddressList();
          setTimeout(() => {
            $('#OCModal').modal("toggle");
          }, 1000);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.addressForm.controls['poc_profile'] = file;
    // this.fileSelected = true;
    // console.log(this.form.controls[i].controls['poc_profile'].value);
  }

}
