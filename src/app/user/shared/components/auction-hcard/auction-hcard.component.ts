import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-auction-hcard',
  templateUrl: './auction-hcard.component.html',
  styleUrls: ['./auction-hcard.component.css']
})
export class AuctionHcardComponent implements OnInit {

  @Input() auctionDetail: any;
  @Output() removeItem = new EventEmitter<any>();
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

  onRemoveBtnClick(e: any) {
    this.removeItem.next(e);
  }

}
