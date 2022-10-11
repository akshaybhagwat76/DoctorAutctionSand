import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSharedModule } from '../shared/shared.module';
import { ManageRoutingModule } from './manage-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductsComponent } from './products/products.component';
import { GradesComponent } from './grades/grades.component';
import { TruckSizeComponent } from './truck-size/truck-size.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsComponent } from './terms/terms.component';
import { DeliveryPaymentTermsComponent } from './delivery-payment-terms/delivery-payment-terms.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PincodesComponent } from './pincodes/pincodes.component';
import { LocationsComponent } from './locations/locations.component';
import { FixedFeeProductsComponent } from './fixed-fee-products/fixed-fee-products.component';

@NgModule({
  declarations: [ProductsComponent, GradesComponent, TruckSizeComponent, TermsComponent, DeliveryPaymentTermsComponent, PincodesComponent, LocationsComponent, FixedFeeProductsComponent],
  imports: [CommonModule, ManageRoutingModule, AdminSharedModule, NgSelectModule, ReactiveFormsModule, EditorModule, FormsModule],
  exports: [],
})
export class ManageModule {}
