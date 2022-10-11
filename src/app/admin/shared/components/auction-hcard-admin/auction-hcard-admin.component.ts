import { Component, Input, OnInit } from '@angular/core';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-auction-hcard-admin',
  templateUrl: './auction-hcard-admin.component.html',
  styleUrls: ['./auction-hcard-admin.component.css']
})
export class AuctionHcardAdminComponent implements OnInit {

  @Input() auctionDetail: any;
  constructor(public urlService: UrlService) { }

  ngOnInit(): void {
    console.log(this.auctionDetail);
    let amount = 0;
    if(this.auctionDetail){
      if(this.auctionDetail.hasOwnProperty('security_deposit_type') && this.auctionDetail.security_deposit_type == 'percent'){
        amount = (this.auctionDetail.lot_size * +this.auctionDetail.start_bid) * +this.auctionDetail.security_deposit/100;
      }else{
        amount = this.auctionDetail.security_deposit;
      }
      this.auctionDetail.security_deposit = amount;
    }
  }

}
