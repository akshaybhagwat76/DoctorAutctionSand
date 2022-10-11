import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { SECURITY_DEPOSIT_ENABLED } from 'src/app/shared/constants';

// Service
import { ListingService, RegisterService } from 'src/app/shared/services';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { UserService } from 'src/app/shared/services/user.service';

declare let $: any;
@Component({
  selector: 'app-live-details',
  templateUrl: './live-details.component.html',
  styleUrls: ['./live-details.component.css']
})
export class LiveDetailsComponent implements OnInit {
  auctionId: any = '';
  stateList: any;
  cityList: any;
  addressList: any[] = [];
  dial_code = [
    { code: '91', name: '+91' }
  ];

  addressForm: any;
  user: any;
  auctionDetails: any;
  hours: any;
  startDate: any;
  totalSeconds = 120;
  selectedAddress: any;
  isDeliverable: any;
  modalId = 'securityDepositModal';
  modalData = {
    title: '',
    text: ''
  };
  pincodeModalId = 'pincodeModal';
  pincodeModalData ={
    title: 'Servicable Pincodes',
    text: '',
    showCancel: false
  }
  isTermChecked: any;
  tncText : any;
  deliveryText : any;
  paymentText : any;
  sdBalanceSufficient: boolean= false;
  passbookAmt:any;
  sdAmt:any;
  clearTimer:boolean=false;
  analysisReport:any;
  concertReport:any;
  constructor(
    private route: ActivatedRoute,
    private _router :Router,
    private _listingService: ListingService,
    private fb: FormBuilder,
    public _registerService: RegisterService,
    private _userService: UserService,
    public urlService: UrlService,
    private toastService: ToastService) {
    this.auctionId = this.route.snapshot.params.auctionId;
   }

  ngOnInit(): void {
    this.getAddressList();
    this.getStateList();
    this.getAuctionDetail(this.auctionId);
    // this.getCityList(26);
    this.initForm();
    this.user = localStorage.getItem('doctor-sand-user');
    this.user = JSON.parse(this.user);
    this.addressForm.controls['user_id'].setValue(this.user.user_id);
    this.getStaticContent();
    this.checkSecurityBalance();
    // console.log(this.user);
  }
  ngOnDestroy():void{
    this.clearTimer = true;
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
      poc_mobile: ['', [Validators.required,Validators.pattern('[0-9]{10}')]],
      dial_code: new FormControl({value: '91', disabled: true}, Validators.required)
    });
  }

  // Go2Tab
  goToTab(id:any){
    if(id){
      document.getElementById(id)?.click();
    }
  }

  getAuctionDetail(id: any){
    this._userService.getAuctionDetail(id)
        .subscribe(success=>{
          console.log(success);
          this.auctionDetails = success.result;
          const reports = this.auctionDetails.reports;
            if(reports && reports.length > 0){
              reports.forEach((element:any) => {
                if(element.report_type == 1){
                  this.analysisReport = element.path;
                }
                if(element.report_type == 2){
                  this.concertReport = element.path;
                }
              });
            }
          // timer(1000, 1000)
          // .pipe(
          //   map((x: number) => {
          //     // const newDate = new Date(new Date().getTime() - new Date(this.auctionDetails.from_datetime).getTime());
          //     // newDate.setSeconds(newDate.getSeconds() - x);
          //     // return newDate;
          //     const dateOne = this.auctionDetails.to_datetime;
          //     const dateTwo = new Date();
          //     const dateOneObj: any = new Date(dateOne);
          //     const dateTwoObj: any = new Date(dateTwo);
          //     const milliseconds = Math.abs(dateTwoObj - dateOneObj);
          //     const hours = Math.round(milliseconds / 36e5);
          //     // this.hours = hours;
          //     // var minutes = Math.round(Math.floor(milliseconds / 60000));
          //     // var seconds = Math.round(((milliseconds % 60000) / 1000));
          //     // var d = Math.floor(t / cd),
          //     let a = this.msToTime(milliseconds);
          //     return {hour: hours, min: a.min, sec: a.sec};
          //     // return {hour: hours, min: minutes, sec: seconds}
          //   })
          // )
          // .subscribe(t => {
          //   $('#hour-label').html(t.hour);
          //   $('#min-label').html(t.min);
          //   $('#sec-label').html(t.sec);
          // });
          this.runTimer();
        },error =>{
          this.auctionDetails = null;
        });
  }

//   runTimer() {
//     var countDownDate = new Date(this.auctionDetails.to_datetime).getTime();
//   // Update the count down every 1 second
//     var x = setInterval(()=> {
//       if(this.clearTimer){
//         clearInterval(x);
//       }
//       // Get today's date and time
//       var now = new Date().getTime();
//       // Find the distance between now and the count down date
//       var distance = countDownDate - now;
//       // Time calculations for days, hours, minutes and seconds
//       // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       $('#hour-label-live').html(hours <= 0 ? '00' : hours.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
//       $('#min-label-live').html(minutes <= 0 ? '00' : minutes.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
//       $('#sec-label-live').html(seconds <= 0 ? '00' : seconds.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
//       // If the count down is finished, write some text
//       if (distance < 0) {
//         clearInterval(x);
//       }
//     }, 1000);
// }

runTimer() {
  var countDownDate = moment(this.auctionDetails.end_time, "HH:mm:ss");
  // Update the count down every 1 second
  var x = setInterval(()=> {
    countDownDate.subtract(1, 'seconds');

    let hours = countDownDate.get('hours');
    let minutes = countDownDate.get('minutes');
    let seconds = countDownDate.get('seconds');
    $('#hour-label-live').html(hours <= 0 ? '00' : hours.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
    $('#min-label-live').html(minutes <= 0 ? '00' : minutes.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
    $('#sec-label-live').html(seconds <= 0 ? '00' : seconds.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
    if (countDownDate.get('hours') == 0 && countDownDate.get('minutes') == 0 && countDownDate.get('seconds') == 0) {
      clearInterval(x);
    }
    if(this.clearTimer){
      clearInterval(x);
    }
  }, 1000);
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

  getAddressList(){
    this._userService.getUserAddressList()
        .subscribe(success=>{
          this.addressList = success.result;
        },  error=>{
          this.addressList = [];
        })
  }

  onAddressChange(e: any) {
    this.selectedAddress = e;
  }

  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.addressForm.controls['poc_profile'] = file;
    // this.fileSelected = true;
    // console.log(this.form.controls[i].controls['poc_profile'].value);
  }

  submitAddressForm() {
    // if(this.addressForm.invalid) {
    //   Object.keys(this.addressForm.controls).forEach(key => {
    //     this.addressForm.get(key).markAsTouched();
    //   });
    //   return;
    // }
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
    formData.append('for_bid','1');
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

  onConfirmServiceAddress() {
    this._userService.checkServiceLocation({auction_id: this.auctionId, address_id: this.selectedAddress.id}).subscribe(
      (success) => {
        console.log(success);
        // document.getElementById('modal-close-btn')?.click();
        // if(success.success) {
          this.initForm();
          // $('#OCFormModal').modal("toggle");
          // this.getAddressList();
          if(success.result) {
            this.isDeliverable = 'true';
            this.showSuccess(success.error.message);
          } else {
            // alert('This service is not available to this address.')
            this.isDeliverable = 'false';
            this.showDanger(success.error.message);
          }
          $('#OCModal').modal("toggle");
        // }
      },
      (error) => {
        console.log(error);
        this.showDanger(error.message);
      }
    );
  }

  onRegister() {
    if(this.isDeliverable == 'true'){
      if(!this.isTermChecked) {
        this.showDanger('Please accept terms and conditions.');
        return;
      }
      if(SECURITY_DEPOSIT_ENABLED) {
        if(!this.sdBalanceSufficient){
          this.modalData.text = 'The current available limit in your Security Deposit account is Rs. '+this.passbookAmt+'/-. The limit required to participate in this auction is Rs. '+this.sdAmt+'/-.  Kindly refill your Security Deposit account with Rs. '+(this.sdAmt - this.passbookAmt)+'/- to participate in this auction.'
          this.modalData.title = 'Insufficient balance';
          $('#' + this.modalId).modal('show');
        }else{
          // this.modalData.title = 'Confirm auction participation';
          // this.modalData.text = 'Security deposit amount  ₹ '+this.auctionDetails.security_deposit+' will be withheld from your ePassbook.'
        this.submitRegistration();
        }
      } else {
        this.submitRegistration();
      }
    } else {
      this.showDanger('Please select delivery address.');
      
    }
  }

  onSecurityModalResponse(res: boolean) {
    if(res) {
      if(!this.sdBalanceSufficient){
        this._router.navigateByUrl("user/epassbook");
      }else{
        this.submitRegistration();
      }
    }
  }

  checkSecurityBalance(){
    this._userService.checkPassbookAmount({auction_id:this.auctionId})
      .subscribe(success=>{
        if(success.success){
          this.sdBalanceSufficient = true;
        }else{
          this.sdBalanceSufficient = false;
          this.passbookAmt = success.result.passbookAmt;
          this.sdAmt = success.result.sdAmt;
        }
      });
  }

  submitRegistration() {
    this._userService.createAuctionBider({auction_id: this.auctionId, address_id: this.selectedAddress.id}).subscribe(
      (success) => {
        console.log(success);
        // document.getElementById('modal-close-btn')?.click();
        if(success.success) {
          this._router.navigate(['/user/auction/bid/' + this.auctionId]);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getStaticContent()
  {
    this._userService.getStaticText()
      .subscribe(success=>{
        console.log(success);
        const staticObj = success.result;
        if(staticObj && staticObj.length > 0)
        staticObj.forEach((element:any) => {
          if(element.type == "delivery"){
            this.deliveryText = element.content;
          }
          if(element.type == "general"){
            this.tncText = element.content;
          }
          if(element.type == "payment"){
            this.paymentText = element.content;
          }
        });
      })
  }

  getServicePincodes()
  {
    this._userService.getServiceablePincodes(this.auctionId).subscribe(
      (success)=>{
        if(success.success){
          const pincodes = success.result;
          if(pincodes && pincodes.length > 0){
            // this.pincodeModalData.text = pincodes.join();
            this.pincodeModalData.text = '';
            pincodes.forEach((e: any) => {
              this.pincodeModalData.text += e + '</br>';
            });
          }else{
          this.pincodeModalData.text = 'No serviceable pincodes';
          }
          $('#' + this.pincodeModalId).modal('show');
        }
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  onModalResponse(event:any){}

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }
}
