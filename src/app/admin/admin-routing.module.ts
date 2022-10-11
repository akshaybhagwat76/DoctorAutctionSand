import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'sellers',
        pathMatch: 'prefix',
      },
      {
        path: 'sellers',
        loadChildren: () =>
          import('./sellers-list/sellers-list.module').then(
            (m) => m.SellersListModule
          ),
      },
      {
        path: 'buyers',
        loadChildren: () =>
          import('./buyers-list/buyers-list.module').then(
            (m) => m.BuyersListModule
          ),
      },
      {
        path: 'auctions',
        loadChildren: () =>
          import('./auction/auction.module').then(
            (m) => m.AuctionModule
          ),
      },
      {
        path: 'fixed-fee-products',
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
        path: 'manage',
        loadChildren: () =>
          import('./manage/manage.module').then(
            (m) => m.ManageModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then(
            (m) => m.ReportsModule
          ),
      },
      {
        path: 'enquiries',
        loadChildren: () =>
          import('./enquiries/enquiries.module').then(
            (m) => m.EnquiriesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
