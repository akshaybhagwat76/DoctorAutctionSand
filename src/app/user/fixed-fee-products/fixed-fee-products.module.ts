import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FixedFeeProductsComponent } from './fixed-fee-products/fixed-fee-products.component';
import { SharedModule } from '../shared/shared.module';
import { FixedFeeProductDetailsComponent } from './fixed-fee-product-details/fixed-fee-product-details.component';
import { FixedFeeProductRoutingModule } from './fixed-fee-product-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from 'src/app/shared/common-component.module';



@NgModule({
  declarations: [FixedFeeProductsComponent, FixedFeeProductDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FixedFeeProductRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    // CommonComponentModule
  ],
  exports:    [ CurrencyPipe ],
  providers:    [ CurrencyPipe ]
})
export class FixedFeeProductsModule { }
