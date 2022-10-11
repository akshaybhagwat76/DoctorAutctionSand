import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellerAcceptanceComponent} from './seller-acceptance/seller-acceptance.component';
import { BuyerPrAcceptanceComponent} from './buyer-pr-acceptance/buyer-pr-acceptance.component';

const routes: Routes = [
  { path: 'seller-acceptance/:auctionId/:token/:type/:orderType', component: SellerAcceptanceComponent },
  { path: 'seller-acceptance/:auctionId/:token/:type', component: SellerAcceptanceComponent },
  { path: 'buyer-pr-acceptance/:auctionId/:token', component: BuyerPrAcceptanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmEmailRoutingModule { }
