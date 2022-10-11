import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/shared/services';
import { WindowRefService } from '../../shared/services/window-ref.service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.css'],
  providers: [WindowRefService]
})
export class StepThreeComponent implements OnInit {

  constructor(private winRef: WindowRefService,
            private registerService: RegisterService,
            private zone :NgZone,
            private _router :Router) { }
  showCoupon : boolean = false;
  showCouponAmt : boolean = false;
  couponCode: any = "";
  registrationAmt = 0;
  gstAmount = 0;
  totalPayableAmount = 0;
  discountAmount = 0;
  netAmount = 0;
  baseAmountGst = 0;
  amountPayWOCoupon = 0;
  productId = 0;
  showCouponError: boolean = false;
  couponError = '';
  isPanExists = 0;
  ngOnInit(): void {
    this.getRegAmount();
  }

  getRegAmount() {
    this.registerService.getRegAmount().subscribe(
      (success) => {
        console.log(success);
        this.isPanExists = success.result.is_pan_exists;
        this.registrationAmt = success.result.base_amount;
        this.gstAmount = success.result.cgst_applied ? (success.result.sgst_amount+success.result.cgst_amount):success.result.gst_amount;
        this.totalPayableAmount = success.result.amount_payable;
        this.productId = success.result.product_id;
      },
      (fail) => {
        console.log(fail);
        this.productId = 0;
      }
    );
  }
  createRzpayOrder() {

    let data = {
        "products" : [{
            "product_id" : this.productId,
            "quantity" : 1
        }],
        "coupon_applied" : this.couponCode
    }
      this.registerService.makeOrder({ data }).subscribe(
        (success) => {
          console.log(success);
          let amount = success.result.amount;
          if(amount == 0){
            let order_id = success.result.order_id;
            this.updateOrderForPanExists(order_id,true);
          }else{
            this.payWithRazor(success.result);
          }
        },
        (fail) => {
          console.log(fail);
        }
      );
  }
  payWithRazor(val: any) {
    const options: any = {
      key: val.razorpayKey,
      amount: val.amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'DOCTOR SAND', // company name or product name
      description: '',  // product description
      image: '../assets/img/drsandlogo.png', // company logo or product image
      order_id: val.rpOrderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      prefill: {
        name: val.name,
        email: val.email,
        contact: val.contactNumber
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0988CE'
      }
    };
    options.handler = ((response: any, error: any) => {
      options.response = response;
      response.order_id = val.order_id;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
      this.registerService.verifyPaymentSignature({ response }).subscribe(
        (success) => {
          if(success.success && success.error.code == '200') {
            this.zone.run(()=>{
              this._router.navigate(['/register/success']);
            })

          } else {
            this.zone.run(()=>{
              this._router.navigate(['/register/failed']);
            })

          }
        },
        (fail) => {
          console.log(fail);
          this.zone.run(()=>{
            this._router.navigate(['/register/failed']);
          })
        }
      );
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  submitCopupon(cc: any){
    console.log(cc.value);

    if(cc.value == "") {
      this.showCouponError = true;
      this.couponError = "Please enter Coupon Code";
      return;
    }

    this.couponCode = cc.value;
    this.registerService.validateCoupon({ coupon_applied: this.couponCode, product_id: this.productId }).subscribe(
      (success) => {
        if(success.success) {
          this.showCouponAmt = true;
          this.discountAmount = success.result.discount_amount;
          this.registrationAmt = success.result.base_amount;
          this.netAmount = success.result.net_amount;
          this.gstAmount = success.result.sgst_applied ? (success.result.sgst_amount+success.result.cgst_amount):success.result.gst_amount;
          this.totalPayableAmount = success.result.amount_payable;
          this.baseAmountGst = success.result.sgst_applied ? (success.result.base_amount_cgst + success.result.base_amount_sgst):success.result.base_amount_gst;
          this.amountPayWOCoupon = success.result.amount_payable_wo_coupon;
          this.showCouponError = false;
          this.showCoupon = false;
        } else {
          this.showCouponError = true;
          this.couponError = success.error.message;
          this.couponCode = "";
        }
      },
      (fail) => {
        console.log(fail);
        this.showCouponError = true;
        this.couponError = 'something went wrong, please try again later';
      }
    );
  }
  removeCoupon(){
    this.showCouponAmt = false;
    this.showCouponError = false;
    this.totalPayableAmount = this.amountPayWOCoupon;
    this.discountAmount = 0;
    this.gstAmount = this.baseAmountGst;
    this.couponCode = '';
  }

  createPayOrder(){
    let data = {
      "products" : [{
          "product_id" : this.productId,
          "quantity" : 1
      }],
      "coupon_applied" : this.couponCode
  }
    this.registerService.makeOrder({ data }).subscribe(
      (success) => {
        console.log(success);
        let order_id = success.result.order_id;
        this.updateOrderForPanExists(order_id);
      },
      (fail) => {
        console.log(fail);
      }
    );
  }

  updateOrderForPanExists(order_id : any,is_zero_amount : boolean = false){
    let response;    
    if(!is_zero_amount){
      response = {
        order_id : order_id,
        is_pan_exists : this.isPanExists
      }
    }else{
      response = {
        order_id : order_id,
        is_zero_amount : is_zero_amount
      }
    }
    this.registerService.verifyPaymentSignature({ response }).subscribe(
      (success) => {
        if(success.success && success.error.code == '200') {
          this.zone.run(()=>{
            this._router.navigate(['/register/success']);
          })

        } else {
          this.zone.run(()=>{
            this._router.navigate(['/register/failed']);
          })

        }
      },
      (fail) => {
        console.log(fail);
        this.zone.run(()=>{
          this._router.navigate(['/register/failed']);
        })
      }
    );
  }
}
