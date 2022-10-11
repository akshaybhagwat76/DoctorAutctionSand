import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionComponent } from './auction.component';
import { Routes, RouterModule } from '@angular/router';

// Component
import { DashboardComponent } from './dashboard/dashboard.component';
import { BidderTableComponent } from './bidder-table/bidder-table.component';
import { UpcomingDetailsComponent } from './upcoming-details/upcoming-details.component';
import { WonDetailsComponent } from "./won-details/won-details.component";
import { LostDetailsComponent } from "./lost-details/lost-details.component";
import { LiveDetailsComponent } from './live-details/live-details.component';
import { BidWinnerComponent } from "./bid-winner/bid-winner.component";
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  {
    path: '',
    component: AuctionComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'prefix',
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'bid/:auctionId',
        component: BidderTableComponent
      },
      {
        path: 'upcoming/:auctionId',
        component: UpcomingDetailsComponent
      },
      {
        path: 'won/:auctionId',
        component: WonDetailsComponent
      },
      {
        path: 'lost/:auctionId',
        component: LostDetailsComponent
      },
      {
        path: 'live/:auctionId',
        component: LiveDetailsComponent
      },
      {
        path: 'bid-result/:auctionId',
        component: BidWinnerComponent
      },
      {
        path: 'bid-result/:auctionId/:token',
        component: BidWinnerComponent
      },
      {
        path: 'invoices/:consignmentId',
        component:InvoiceComponent
      }
    ],
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuctionRoutingModule { }
