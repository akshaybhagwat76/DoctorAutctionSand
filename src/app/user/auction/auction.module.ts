import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// Module
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from './../shared/shared.module';

// routing
import { AuctionRoutingModule } from './auction-routing.module';

// components
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuctionComponent } from './auction.component';
import { BidderTableComponent } from './bidder-table/bidder-table.component';
import { UpcomingDetailsComponent } from './upcoming-details/upcoming-details.component';
import { WonDetailsComponent } from './won-details/won-details.component';
import { LostDetailsComponent } from './lost-details/lost-details.component';
import { LiveDetailsComponent } from './live-details/live-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BidWinnerComponent } from './bid-winner/bid-winner.component';
import { InvoiceComponent } from './invoice/invoice.component';


@NgModule({
  declarations: [
    AuctionComponent,
    DashboardComponent,
    BidderTableComponent,
    UpcomingDetailsComponent,
    WonDetailsComponent,
    LostDetailsComponent,
    LiveDetailsComponent,
    BidWinnerComponent,
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    AuctionRoutingModule,
    NgSelectModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AuctionModule { }
