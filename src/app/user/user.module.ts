import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// routing
import { UserRoutingModule } from './user-routing.module';

// Components
import { LayoutComponent } from "./layout/layout.component";
import { UserHeaderComponent } from './shared/components/user-header/user-header.component';
import { FixedFeeProductsModule } from './fixed-fee-products/fixed-fee-products.module';
import { CartComponent } from './cart/cart.component';
import { SharedModule } from './shared/shared.module';
@NgModule({
  declarations: [LayoutComponent, UserHeaderComponent, CartComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FixedFeeProductsModule,
    SharedModule
  ]
})
export class UserModule { }
