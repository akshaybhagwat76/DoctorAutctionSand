import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-lost-details',
  templateUrl: './lost-details.component.html',
  styleUrls: ['./lost-details.component.css']
})
export class LostDetailsComponent implements OnInit {
  auctionId: any = '';
  
  constructor(private route: ActivatedRoute) {
    this.auctionId = this.route.snapshot.params.auctionId;
  }

  ngOnInit(): void {
  }

}
