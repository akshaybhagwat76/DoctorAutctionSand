import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEmailRoutingModule } from './confirm-email.routing.module';
import { SellerAcceptanceComponent } from './seller-acceptance/seller-acceptance.component';
import { BuyerPrAcceptanceComponent } from './buyer-pr-acceptance/buyer-pr-acceptance.component';
import { SharedModule } from '../user/shared/shared.module';

@NgModule({
  declarations: [SellerAcceptanceComponent, BuyerPrAcceptanceComponent],
  imports: [
    CommonModule,
    ConfirmEmailRoutingModule,
    SharedModule
  ]
})
export class ConfirmEmailModule { }
