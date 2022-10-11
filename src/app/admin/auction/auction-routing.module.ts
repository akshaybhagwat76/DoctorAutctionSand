import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';
import { AuctionListComponent } from './auction-list/auction-list.component';
import { ConsignmentComponent } from './consignment/consignment.component';
import { CreateAuctionComponent } from './create-auction/create-auction.component';


const routes: Routes = [
  { path: 'list', component: AuctionListComponent },
  { path: 'create', component: CreateAuctionComponent },
  { path: 'detail/:id', component: AuctionDetailsComponent },
  { path: 'consignment/:id', component: ConsignmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuctionRoutingModule { }
