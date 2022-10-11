import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryPaymentTermsComponent } from './delivery-payment-terms/delivery-payment-terms.component';
import { FixedFeeProductsComponent } from './fixed-fee-products/fixed-fee-products.component';
import { GradesComponent } from './grades/grades.component';
import { LocationsComponent } from './locations/locations.component';
import { PincodesComponent } from './pincodes/pincodes.component';
import { ProductsComponent } from './products/products.component';
import { TermsComponent } from './terms/terms.component';
import { TruckSizeComponent } from './truck-size/truck-size.component';


const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'fixed-fee-products', component: FixedFeeProductsComponent },
  { path: 'grades', component: GradesComponent },
  { path: 'truck-size', component: TruckSizeComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'payment-delivery-term-days', component: DeliveryPaymentTermsComponent },
  { path: 'pincodes', component: PincodesComponent },
  { path: 'locations', component: LocationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
