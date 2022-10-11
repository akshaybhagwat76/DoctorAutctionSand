import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { RegisterService } from 'src/app/shared/services/register.service';
import {
  LOST,
  OR_CONFIRMED_BUYER,
  OR_SENT
} from 'src/app/shared/constants';

@Component({
  selector: 'app-bid-winner',
  templateUrl: './bid-winner.component.html',
  styleUrls: ['./bid-winner.component.css']
})
export class BidWinnerComponent implements OnInit {
  auctionId: any = '';
  show_winner: boolean = false;
  show_success: boolean = false;
  show_await:boolean = false;
  token:any = '';
  bidDetails:any;
  bidAmount : number = 0;
  logisticAmout: number = 0;
  forAmount:number = 0;
  netAmount:number = 0;
  gstAmount:number = 0;
  grossAmount:number = 0;
  isExWorks:boolean = false;
  auctionData:any;
  constructor(private route: ActivatedRoute
    ,private _userService: UserService,private registerService: RegisterService,
    private _router :Router) {
    this.auctionId = this.route.snapshot.params.auctionId;
    this.token = this.route.snapshot.params.token;
    console.log(this.auctionId);
    console.log(this.token);
  }

  ngOnInit(): void {
    console.log(this.token);
    if(!this.token){
      this.getResult();
    }else{
      this.verifyToken(this.token);
    }
  }

  verifyToken(token: any) {
    this.registerService.validateToken({token: token}).subscribe(
      (success) => {
        if(success.success) {
          localStorage.setItem('doctor-sand-user', JSON.stringify(success.result));
          this.getResult();
        }
        // console.log(success);
      },
      error=>{
        console.log(error);
      });
  }

  onConfirm(){
    // this.show_winner = false;
    // this.show_success = true;
  }

  getResult()
  {
    this._userService.getResult(this.auctionId)
      .subscribe(success=>{
        if(success.success){
          console.log(success.result);
          this.bidDetails = success.result;
          // if(this.bidDetails.status == AWAITING_RESULT){
          //   this.show_await = true;
          // }else{

          // }
          if(this.bidDetails.status == OR_SENT || this.bidDetails.status == OR_CONFIRMED_BUYER){
            this.auctionData = this.bidDetails.auction_data;
            this.AmtCalculation();
            this.show_winner = true;
          }else
          if(this.bidDetails.status == LOST)
          {
            this.show_success = true;
          }else{
            this.show_await = true;
          }
        }
      });
  }

  AmtCalculation(){
    this.bidAmount  = parseInt(this.bidDetails.your_bid);
    this.logisticAmout  = parseInt(this.auctionData.logistic_price);
    if(this.isExWorks){
      this.forAmount = this.bidAmount;
    }else{
      this.forAmount = this.bidAmount + this.logisticAmout;
    }

    this.netAmount = this.forAmount * parseInt(this.auctionData.lot_size);
    this.gstAmount = this.netAmount * (parseInt(this.auctionData.gst) / 100);
    this.grossAmount = this.netAmount + this.gstAmount;
  }

  displayForType(){
    this.isExWorks = false;
    this.AmtCalculation();
  }

  displayExType(){
    this.isExWorks = true;
    this.AmtCalculation();
  }

  confirmWinner()
  {
    let resp = OR_CONFIRMED_BUYER;
    this._userService.confirmORResponseBuyer({auction_id:this.auctionId,state:resp}).subscribe(
      (success: any)=>{
        if(success.success){
          this._router.navigate(['/user/dashboard']);
        }
      }
    )
  }
}
