import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BUYER_ACCEPTED, BUYER_REJECTED } from 'src/app/shared/constants';
import { UrlService } from 'src/app/shared/services/url.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-confirm-pdf',
  templateUrl: './confirm-pdf.component.html',
  styleUrls: ['./confirm-pdf.component.css']
})
export class ConfirmPdfComponent implements OnInit {
  orderId: any;
  orderData: any;
  constructor(private route: ActivatedRoute,
    private _router :Router,
    private _userService: UserService,
    public urlService: UrlService) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params.order_id;
    this.getOrderDetails();
  }

  onAccept() {
    // this._router.navigate(['/user/orders/details/'+ 223344]);
    this.confirmBuyerOrder(true);
  }

  getOrderDetails()
  {
    this._userService.getUserOrderDetails(this.orderId).subscribe(
      (success)=>{
        if(success.success){
          this.orderData = success.result;
        }
      }
    )
  }

  confirmBuyerOrder(event:any){
    let resp = 0;
    if(event){
      resp = BUYER_ACCEPTED;
    }else{
      resp = BUYER_REJECTED;
    }
    this._userService.orderConfirmBuyer({order_id:this.orderId,status:resp}).subscribe(
      (success: any)=>{
        if(success.success){
          this._router.navigate(['/user/orders/details/'+ this.orderId]);
        }
      }
    );
  }

}
