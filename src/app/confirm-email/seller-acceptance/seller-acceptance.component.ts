import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { RegisterService } from 'src/app/shared/services/register.service';
import { UserService } from 'src/app/shared/services/user.service';
import { OC_CONFIRMED_SELLER, OC_REJECTED_SELLER, OR_CONFIRMED_SELLER, OR_REJECTED_SELLER, SELLER_CONFIRMED, SELLER_REJECTED } from 'src/app/shared/constants';

declare let $: any;
@Component({
  selector: 'app-seller-acceptance',
  templateUrl: './seller-acceptance.component.html',
  styleUrls: ['./seller-acceptance.component.css']
})
export class SellerAcceptanceComponent implements OnInit {
  modalId = 'acceptBuyer';
  modalId2 = 'acceptBuyerOrder';
  modalData = {
    title: '',
    text: '',
    primaryBtnText:'',
    secondaryBtnText:''
  };
  auctionId:any;
  token:any;
  type: any;
  orderType: any;
  constructor(private route: ActivatedRoute,
    private registerService: RegisterService,
    private _userService: UserService,
    private _router :Router) { }

  ngOnInit(): void {
    this.auctionId = this.route.snapshot.params.auctionId;
    this.token = this.route.snapshot.params.token;
    this.type = this.route.snapshot.params.type;
    this.orderType = this.route.snapshot.params.orderType;
    console.log(this.auctionId);
    console.log(this.token);
    this.verifyToken(this.token);
  }

  verifyToken(token: any) {
    this.registerService.validateToken({token: token}).subscribe(
      (success) => {
        if(success.success) {
          localStorage.setItem('doctor-sand-user', JSON.stringify(success.result));
          if(this.orderType == 'fixed_price') {
            this.getOrderDetails();
          } else {
            if(this.type == "OR")
              this.getBuyer();
            else
              this.showModel('');
          }
        }
      },
      error=>{
        console.log(error);
      });
  }

  getBuyer()
  {
    this._userService.buyerToConfirm({auction_id:this.auctionId}).subscribe(
      (success)=>{
        if(success.success){
          console.log(success);
          this.showModel(success.result);
        }
      }
    )
  }

  getOrderDetails()
  {
    this._userService.getUserOrderDetails(this.auctionId).subscribe(
      (success)=>{
        if(success.success){
          // console.log(success);
          this.showOrderModel(success.result);
          // this.showModel(success.result);
        }
      }
    )
  }

  showModel(data:any){
    if(this.type == "OR") {
      this.modalData.text = 'Buyer '+data.name+' has been selected as a winner for auction '+data.auction_number+' (' + (data.is_exworks ? 'EX-WORKS' : 'FOR') + ') '
      + (data.is_exworks ? '' : 'and logistic price is INR ' + data.logistic_price + '/ton') + '.<br/> Are you sure you want to continue?';
      this.modalData.title = 'Buyer Confirmation';
    } else {
      this.modalData.text = 'Do you want to accept order confirmation?';
      this.modalData.title = 'Order Confirmation';
    }
    this.modalData.primaryBtnText = "YES";
    this.modalData.secondaryBtnText = "No";
    $('#' + this.modalId).modal('show');
  }

  confirmBuyer(event:any){
    let resp = 0;
    if(event){
      if(this.type == "OR")
        resp = OR_CONFIRMED_SELLER;
      else
        resp = OC_CONFIRMED_SELLER;
    }else{
      if(this.type == "OR")
        resp = OR_REJECTED_SELLER;
      else
        resp = OC_REJECTED_SELLER;
    }
    if(this.type == "OR") {
      this._userService.confirmResponse({auction_id:this.auctionId,state:resp}).subscribe(
        (success: any)=>{
          if(success.success){
            this._router.navigate(['/auth']);
          }
        }
      );
    } else {
      this._userService.confirmOCSellerResponse({auction_id:this.auctionId,state:resp}).subscribe(
        (success: any)=>{
          if(success.success){
            this._router.navigate(['/auth']);
          }
        }
      );
    }
  }

  confirmBuyerOrder(event:any){
    let resp = 0;
    if(event){
      resp = SELLER_CONFIRMED;
    }else{
      resp = SELLER_REJECTED;
    }
    this._userService.orderConfirmSeller({order_id:this.auctionId,status:resp}).subscribe(
      (success: any)=>{
        if(success.success){
          this._router.navigate(['/auth']);
        }
      }
    );
  }

  showOrderModel(data:any){
    this.modalData.text = 'Buyer '+data.buyer.name+' placed an order '+data.order_number+' (' + (data.delivery_option === 2 ? 'EX-WORKS' : 'FOR') + ') '
    + (data.delivery_option === 2 ? '' : 'and logistic price is INR ' + data.logistic_price + '/'+ data.truck_size + ' ton') + '.<br/> Are you sure you want to continue?';
    this.modalData.title = 'Order Confirmation';
    this.modalData.primaryBtnText = "YES";
    this.modalData.secondaryBtnText = "NO";
    $('#' + this.modalId2).modal('show');
  }

}
