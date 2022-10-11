import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sd-payment-response',
  templateUrl: './sd-payment-response.component.html',
  styleUrls: ['./sd-payment-response.component.css']
})
export class SdPaymentResponseComponent implements OnInit {
  paymentResponse:string = '';
  secCount:number = 10;
  response:string = '';
  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {    
    const resp = this.route.snapshot.paramMap.get('resp');
    console.log(resp);
    switch (resp) {
      case 'success':
        this.paymentResponse = "Security Deposit payment successful."
        this.response = "successful";
        this.startCount();
        break;
      case 'fail':
        this.response = "failed"
        this.paymentResponse = "Security Deposit payment failed."
        this.startCount();
        break;
      default:
        this.paymentResponse = "You have already paid Security Deposit."
        this.response = "already paid";
        this.startCount();
        break;
    }
  }
  startCount() {
    this.secCount = 5;
    let interval = setInterval(() => {
      --this.secCount;
      if(this.secCount < 1) {
        window.location.href = "https://www.doctorsand.com/";
        clearInterval(interval);
      }
    }, 1000);
  }
}
