import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmPdfComponent } from './confirm-pdf/confirm-pdf.component';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderConsignmentsComponent } from './order-consignments/order-consignments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [OrdersComponent, ConfirmPdfComponent, OrderDetailsComponent, OrderConsignmentsComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    NgSelectModule,
    SharedModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbPopoverModule
  ],
  exports: [OrderConsignmentsComponent]
})
export class OrdersModule { }
