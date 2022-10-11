import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FixedFeeProductsComponent } from './fixed-fee-products/fixed-fee-products.component';
import { FixedFeeProductDetailsComponent } from './fixed-fee-product-details/fixed-fee-product-details.component';

// Component

const routes: Routes = [
  {
    path: '',
    component: FixedFeeProductsComponent,
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'prefix',
      },
      {
        path: 'products',
        component: FixedFeeProductsComponent
      },
    ],
  },
  {
    path: 'product/details/:id',
    component: FixedFeeProductDetailsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixedFeeProductRoutingModule { }
