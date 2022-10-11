import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.css']
})
export class PaymentResponseComponent implements OnInit {
  response: any;

  secCount = 5;

  constructor(private route:ActivatedRoute, private _router :Router) { }

  ngOnInit(): void {
    var n = this._router.url.lastIndexOf('/');
    this.response = this._router.url.substring(n + 1);
    if(this.response == 'success'){
      this.response = 'successful';
    }
    this.startCount()
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
