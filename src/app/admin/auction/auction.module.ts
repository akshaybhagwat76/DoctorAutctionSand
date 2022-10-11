import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSharedModule } from '../shared/shared.module';
import { AuctionListComponent } from './auction-list/auction-list.component';
import { AuctionRoutingModule } from './auction-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';
import { AuctionViewEditComponent } from './auction-view-edit/auction-view-edit.component';
import { SharedModule } from 'src/app/user/shared/shared.module';
import { ConsignmentComponent } from './consignment/consignment.component';
import { AuctionDetailsLiveComponent } from './auction-details-live/auction-details-live.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@NgModule({
  declarations: [AuctionListComponent, CreateAuctionComponent, AuctionDetailsComponent, AuctionViewEditComponent, ConsignmentComponent, AuctionDetailsLiveComponent],
  imports: [
    CommonModule,
    AuctionRoutingModule,
    AdminSharedModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  exports: [AuctionViewEditComponent, AuctionDetailsLiveComponent],
})
export class AuctionModule {}
