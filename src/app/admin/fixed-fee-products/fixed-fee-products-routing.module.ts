import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFixedFeeProductComponent } from './create-fixed-fee-product/create-fixed-fee-product.component';

import { FixedFeeProductsListComponent } from './fixed-fee-product-list/fixed-fee-products-list.component';

const routes: Routes = [
  { path: 'list', component: FixedFeeProductsListComponent },
  { path: 'create', component: CreateFixedFeeProductComponent },
  { path: 'edit/:id', component: CreateFixedFeeProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixedFeeProductsRoutingModule { }
