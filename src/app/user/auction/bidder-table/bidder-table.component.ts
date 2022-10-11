import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { UrlService } from 'src/app/shared/services/url.service';

import {
  BID_REFRESH_SEC,LOCALSTORAGE_USER
} from 'src/app/shared/constants';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ListingService, RegisterService } from 'src/app/shared/services';
import * as moment from 'moment';
import { ToastService } from 'src/app/shared/services/toast.service';

declare let $: any;
@Component({
  selector: 'app-bidder-table',
  templateUrl: './bidder-table.component.html',
  styleUrls: ['./bidder-table.component.css']
})
export class BidderTableComponent implements OnInit {
  auctionId: any = '';
  auctionDetails: any;
  hours: any;
  auctionState: string = 'Auction ends in';
  bidStartPercent: any = 0;
  bidEndPercent: any = 0;
  bidStartRange: any = 0;
  bidEndRange: any = 0;
  topBid: any = 0;
  logisticPrice: any = 0;
  inputBid:any = 0;
  totalForTon:any = 0;
  netForAmount:any = 0;
  lotSize:any = 0;
  totalNetForAmount:any = 0;
  gstAmount:any = 0;
  grossAmount:any = 0;
  highestBid:any = 0;
  IsExWorks: boolean = false;
  bidList:any;
  IsGetBids:boolean = true;
  analysisReport:any;
  concertReport:any;
  userId:number = 0;
  tncText : any;
  deliveryText : any;
  paymentText : any;
  show_overlay: boolean = false;
  buyerBid:any;
  userName:any='';
  modalId = 'confirmationModal';
  modalData = {
    title: '',
    text: '',
    showCancel: false
  };
  pincodeModalId = 'pincodeModal';
  pincodeModalData ={
    title: 'Servicable Pincodes',
    text: '',
    showCancel: false
  };
  auctionEndTime:any;
  clearTimer:boolean=false;
  list : any =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1,18];
  addressForm: any;
  addressList: any[] = [];
  selectedAddress: any;
  isDeliverable: any;
  stateList: any[] = [];
  cityList: any[] = [];
  dial_code = [
    { code: '91', name: '+91' }
  ];

  constructor(private route: ActivatedRoute,
    private _userService: UserService
    , public urlService: UrlService
    ,private router: Router,
    private fb: FormBuilder,
    public _registerService: RegisterService,
    private _listingService: ListingService,
    private toastService: ToastService) {
    this.auctionId = this.route.snapshot.params.auctionId;
  }

  ngOnInit(): void {
    console.log(this.auctionId);
    this.getUserName();
    this.getAuctionDetail(this.auctionId);
    this.Ticker();
    this.getStaticContent();
    // this.getAddressList();
    this.getStateList();
    this.initForm();
    let user: any = localStorage.getItem('doctor-sand-user');
    user = JSON.parse(user);
    this.addressForm.controls['user_id'].setValue(user.user_id);
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

  ngOnDestroy():void{
    this.clearTimer = true;
    this.IsGetBids = false;
  }
  getUserName(){
    const userData: any = localStorage.getItem(LOCALSTORAGE_USER);
    const Data = userData ? JSON.parse(userData) : null;
    if(Data){
      this.userName = Data.name;
    }
  }
  getAuctionDetail(id: any) {
    this._userService.getAuctionDetailForBid(id)
      .subscribe(success => {
        if(success.success){
          this.auctionDetails = success.result;
          this.getAddressList();
          if(new Date() < new Date(this.auctionDetails.from_datetime)){
            this.router.navigateByUrl('/user/auction');
          }else if(new Date() > new Date(this.auctionDetails.to_datetime)){
            // this.router.navigateByUrl('/user/auction/bid-result/'+this.auctionId);
            this.router.navigateByUrl('/user/auction');
          }else{
            // console.log(success);
            this.userId = this.auctionDetails.user_id;
            this.bidStartPercent = this.auctionDetails.min_limit;
            this.bidEndPercent = this.auctionDetails.max_limit;
            const reports = this.auctionDetails.reports;
            this.getLatestBids(this.auctionId);
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
            this.auctionEndTime = this.auctionDetails.time;
            this.runTimer();
          }
        }
      }, error => {
        this.auctionDetails = null;
      });
  }

  getLatestBids(id:any){
    if(this.IsGetBids)
    {
      this._userService.getLatestBids(id)
      .subscribe(success => {
        if(success.success)
        {
          this.bidList = success.result.bidList;
          this.auctionEndTime = success.result.auction_endTime;
          let endTime = moment(this.auctionEndTime, "HH:mm:ss");
          if(this.auctionDetails.timer) {
            if(endTime.get('hours') !== this.auctionDetails.timer.get('hours') || endTime.get('minutes') !== this.auctionDetails.timer.get('minutes')) {
              this.clearTimer = true;
              this.runTimer();
            }
          }
          // console.log(this.bidList);
          if(this.bidList && this.bidList.length > 0){
            this.highestBid = this.bidList[0].bid;
            var otherHighest = false;
            this.buyerBid = null;
            this.bidList.forEach((element:any,index:number )=> {
              if(index == 0 && element.name =="0"){
                otherHighest = true;
              }
              if(otherHighest && !this.buyerBid && element.buyer_id == this.userId){
                this.buyerBid = {
                  index : index+1,
                  name: element.name,
                  bid: element.bid,
                  created_on : element.created_on
                }
                element.delete = true;
              }
            });
          }else{
            this.highestBid = this.auctionDetails.start_bid;
          }
        }else{
          this.highestBid = this.auctionDetails.start_bid;
        }
        this.defaultBids();
      });
    }
  }

  defaultBids(){
    // this.highestBid = parseInt(this.auctionDetails.start_bid);
    // this.bidStartRange =(+this.highestBid + +this.highestBid * (this.bidStartPercent/100)).toFixed(2);
    // this.bidEndRange =(+this.highestBid + +this.highestBid * (this.bidEndPercent/100)).toFixed(2);
    this.bidStartRange = Math.round((+this.highestBid + +this.highestBid * (this.bidStartPercent/100)));
    this.bidEndRange = Math.round((+this.highestBid + +this.highestBid * (this.bidEndPercent/100)));
    this.logisticPrice = +this.auctionDetails.logistic_price;
    this.lotSize = parseFloat(this.auctionDetails.lot_size);
    if(this.inputBid > 0){
      if(!this.IsExWorks){
        this.totalForTon = this.logisticPrice + this.inputBid;
      }else{
        this.totalForTon = this.inputBid;
      }
      this.totalNetForAmount = (+this.totalForTon * this.lotSize).toFixed(2);
      this.gstAmount = (+this.totalNetForAmount * (+this.auctionDetails.gst/100)).toFixed(2);
      this.grossAmount = (+this.totalNetForAmount + +this.gstAmount).toFixed(2);
    }else{
      this.totalForTon = 0;
      this.totalNetForAmount = 0;
      this.gstAmount = 0;
      this.grossAmount = 0;
    }

  }

  // runTimer() {
  //   // Update the count down every 1 second
  //     var x = setInterval(()=> {
  //       if(this.clearTimer){
  //         clearInterval(x);
  //       }
  //       var countDownDate = new Date(this.auctionEndTime).getTime();
  //       // Get today's date and time
  //       var now = new Date().getTime();
  //       // Find the distance between now and the count down date
  //       var distance = countDownDate - now;
  //       // Time calculations for days, hours, minutes and seconds
  //       // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //       var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //       var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //       $('#hour-label-bid').html(hours <= 0 ? '00' : hours.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
  //       $('#min-label-bid').html(minutes <= 0 ? '00' : minutes.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
  //       $('#sec-label-bid').html(seconds <= 0 ? '00' : seconds.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
  //       // If the count down is finished, write some text
  //       if (distance <= 0) {
  //         clearInterval(x);
  //         this.auctionState = "Auction Ends";
  //         this.getResult();
  //       }
  //     }, 1000);
  // }

  runTimer() {
    var countDownDate = moment(this.auctionEndTime, "HH:mm:ss");
    // Update the count down every 1 second
    var x = setInterval(()=> {
      countDownDate.subtract(1, 'seconds');

      this.auctionDetails.timer = countDownDate;
      let hours = countDownDate.get('hours');
      let minutes = countDownDate.get('minutes');
      let seconds = countDownDate.get('seconds');
      $('#hour-label-bid').html(hours <= 0 ? '00' : hours.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
      $('#min-label-bid').html(minutes <= 0 ? '00' : minutes.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
      $('#sec-label-bid').html(seconds <= 0 ? '00' : seconds.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
      if ((countDownDate.get('hours') <= 0 && countDownDate.get('minutes') <= 0 && countDownDate.get('seconds') <= 0) || this.auctionEndTime.includes('-')) {
        clearInterval(x);
        $('#hour-label-bid').html('00');
        $('#min-label-bid').html('00');
        $('#sec-label-bid').html('00');
        this.auctionState = "Auction Ends";
        this.getResult();
      }
      if(this.clearTimer){
        clearInterval(x);
        this.clearTimer = false;
      }
    }, 1000);
  }


  calculateAmt(e: any){

    const amt = $('#inputBid').val();
    if(amt != '')
    this.inputBid = +amt;
    else
    this.inputBid = 0;
    this.calculateAllAmts();
  }

  calculateAllAmts()
  {
    if(!this.IsExWorks){
      this.totalForTon = +this.logisticPrice + +this.inputBid;
    }else{
      this.totalForTon = this.inputBid;
    }
    this.totalNetForAmount = (+this.totalForTon * this.lotSize).toFixed(2);
    this.gstAmount = ((+this.totalNetForAmount * ((+this.auctionDetails.gst)/100)).toFixed(2));
    this.grossAmount = (+this.totalNetForAmount + +this.gstAmount).toFixed(2);
  }

  displayForType(){
    this.IsExWorks =false;
    this.calculateAllAmts();
  }

  displayExType(){
    this.IsExWorks =true;
    this.calculateAllAmts();
  }

  getResult(){
    this.IsGetBids = false;
    // this.router.navigateByUrl('/user/auction/bid-result/'+this.auctionId);
    this._userService.getResult(this.auctionId)
      .subscribe(success=>{
        this.show_overlay = true;
        this.modalData.text = 'The auction has been completed and results would be declared over email';
        this.modalData.title = 'Auction Ended';
        $('#' + this.modalId).modal('show');
      });
  }

  placeBid(){
    $('#inputBid').removeClass('border-danger');
    const amt = $('#inputBid').val();
    var i = new RegExp('^([0-9])*$');
    if(!i.test(amt)) {
      $('#bid-error').text('Please enter numbers only.');
      return;
    }
    if(amt != '') {
      const BidAmount = parseFloat(amt);
      if(BidAmount < parseFloat(this.bidStartRange) || BidAmount > parseFloat(this.bidEndRange)){
        $('#bid-error').text('Your bid is out of current bid range');
        $('#inputBid').addClass('border-danger');
        $('#inputBid').select().focus();
      }else{
        this._userService.createBid({auction_id:this.auctionId,bid:BidAmount,is_exworks:this.IsExWorks})
          .subscribe(success=>{
            if(success.success){
              $('#inputBid').val('')
              $('#bid-error').text('');
            }else{
              $('#bid-error').text('Bid range has been updated');
              $('#inputBid').addClass('border-danger');
              $('#inputBid').select().focus();
            }
            this.getLatestBids(this.auctionId);
          });
      }
    }
  }

  Ticker() {
    var x = setInterval(()=> {
      this.getLatestBids(this.auctionId);
      if (!this.IsGetBids) {
        clearInterval(x);
      }
    }, 1000 * BID_REFRESH_SEC);
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

  onConfirmation(res:any)
  {
    if(res){
      this.router.navigateByUrl('/user/auction');
    }
  }

  refreshBid()
  {
    this.getLatestBids(this.auctionId);
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
    formData.append('for_bid','1');
    this._registerService.update_poc_details(formData).subscribe(
      (success) => {
        console.log(success);
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
          this.selectedAddress = this.addressList.find(x => x.id == this.auctionDetails.address_id);
        },  error=>{
          this.addressList = [];
    });
  }

  onAddressChange(e: any) {
    this.selectedAddress = e;
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

  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.addressForm.controls['poc_profile'] = file;
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }
}
