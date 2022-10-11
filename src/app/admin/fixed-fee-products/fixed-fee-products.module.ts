import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedFeeProductsRoutingModule } from './fixed-fee-products-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FixedFeeProductsListComponent } from './fixed-fee-product-list/fixed-fee-products-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateFixedFeeProductComponent } from './create-fixed-fee-product/create-fixed-fee-product.component';
import { SharedModule } from 'src/app/user/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AdminSharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    FixedFeeProductsListComponent,
    CreateFixedFeeProductComponent
  ],
  imports: [
    CommonModule,
    AdminSharedModule,
    FixedFeeProductsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class FixedFeeProductsModule { }
