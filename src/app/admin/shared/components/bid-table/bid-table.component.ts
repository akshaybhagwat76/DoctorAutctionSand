import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BID_REFRESH_SEC } from 'src/app/shared/constants';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-bid-table',
  templateUrl: './bid-table.component.html',
  styleUrls: ['./bid-table.component.css']
})
export class BidTableComponent implements OnInit {
  IsGetBids:boolean = true;
  @Input() auctionId: any;
  @Input() isLive: boolean = true;
  bidList: any[] = [];
  constructor(private _adminService: AdminService) { }

  ngOnInit(): void {
    this.getLatestBids(this.auctionId);
    if(this.isLive)
      this.Ticker();
  }

  ngOnDestroy():void{
    // this.clearTimer = true;
    this.IsGetBids = false;
  }

  Ticker() {
    var x = setInterval(()=> {
      this.getLatestBids(this.auctionId);
      if (!this.IsGetBids) {
        clearInterval(x);
      }
    }, 1000 * BID_REFRESH_SEC);
  }

  getLatestBids(id:any){
    if(this.IsGetBids)
    {
      this._adminService.getLatestBids(id)
      .subscribe(success => {
        if(success.success)
        {
          this.bidList = success.result.bidList;
        }
      });
    }
  }

  refreshBid()
  {
    this.getLatestBids(this.auctionId);
  }

}
