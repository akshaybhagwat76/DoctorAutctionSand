import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmPdfComponent } from './confirm-pdf/confirm-pdf.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersComponent } from './orders/orders.component';

// Component

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    // children: [
    //   {
    //     path: '',
    //     redirectTo: 'orders',
    //     pathMatch: 'prefix',
    //   },
    //   {
    //     path: 'orders',
    //     component: OrdersComponent
    //   },
    // ],
  },
  {
    path: 'confirm-pdf/:order_id',
    component: ConfirmPdfComponent,
  },
  {
    path: 'details/:order_id',
    component: OrderDetailsComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
