import { Component, OnInit,NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from 'src/app/shared/services/register.service';
import { WindowRefService } from '../../shared/services/window-ref.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [WindowRefService]
})
export class PaymentComponent implements OnInit {

  constructor(private winRef: WindowRefService,
  private zone :NgZone,
  private route:ActivatedRoute,
  private registerService: RegisterService,
  private _router :Router) { }
  productId: number = 3;
  sdResp:any = {};
  processResp = "";
  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    this.getAmount(token);
  }
  
  createRzpayOrder() {
    let data = {
        "products" : [{
            "product_id" : this.productId,
            "quantity" : 1
        }]
    }
      this.registerService.makeOrderForSD({ data }).subscribe(
        (success) => {
          console.log(success);
          let amount = success.result.amount;
          this.payWithRazor(success.result);
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
      this.processResp ="Please wait we are processing your request";
      options.response = response;
      response.order_id = val.order_id;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
      this.registerService.verifyPaymentSignatureSD({ response }).subscribe(
        (success) => {
          if(success.success && success.error.code == '200') {
            this.zone.run(()=>{
              this._router.navigate(['/register/security-deposit/success']);
              // this.ngOnInit();
            });
          } else {            
            this.zone.run(()=>{
              this._router.navigate(['/register/security-deposit/fail']);
              // this.ngOnInit();
            });
          }
        },
        (fail) => {
          console.log(fail);
          this.zone.run(()=>{
            this._router.navigate(['/register/security-deposit/fail']);
            // this.ngOnInit();
          });
        }
      );
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
    console.log("start msg");
  }
  getAmount(token : any){
  this.registerService.sdAmountByToken({token:token}).subscribe(
    (success)=>{
      if(success.success){
        this.sdResp = success.result;
        localStorage.setItem('doctor-sand-user', JSON.stringify(success.result));
        if(this.sdResp.registration_status == '100'){
          this._router.navigate(['/register/security-deposit/paid']);
        }
      }
    });
  }
}
