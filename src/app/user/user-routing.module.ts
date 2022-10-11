import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'auction',
        pathMatch: 'prefix',
      },
      {
        path: 'auction',
        loadChildren: () =>
          import('./auction/auction.module').then(
            (m) => m.AuctionModule
          ),
      },
      {
        path: 'fixed-fee',
        loadChildren: () =>
          import('./fixed-fee-products/fixed-fee-products.module').then(
            (m) => m.FixedFeeProductsModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./orders/orders.module').then(
            (m) => m.OrdersModule
          ),
      },
      {
        path: 'epassbook',
        loadChildren: () =>
          import('./epassbook/epassbook.module').then(
            (m)=> m.EpassbookModule
          )
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then(
            (m)=> m.ProfileModule
          )
      },
      {
        path: 'cart',
        component: CartComponent
      }

    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
