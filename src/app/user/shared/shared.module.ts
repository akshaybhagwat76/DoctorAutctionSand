import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// componencts
import { AuctionHcardComponent } from "./components/auction-hcard/auction-hcard.component";
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { UserToasterComponent } from './components/user-toaster/user-toaster.component';
import { FixedFeeProductCardComponent } from './components/fixed-fee-product-card/fixed-fee-product-card.component';
import { RouterModule } from '@angular/router';
import { ViewPdfComponent } from './components/view-pdf/view-pdf.component';
import { DocsCardComponent } from './components/docs-card/docs-card.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { UserModalComponent, UserModalHeaderComponent, UserModalBodyComponent, UserModalFooterComponent } from './components/modal/user-modal.component';
import { DrsandFormComponent } from './components/drsand-form/drsand-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonListComponent } from './components/common-list/common-list.component';
import { NgSelectModule } from '@ng-select/ng-select';

const userModalComponents = [
  UserModalComponent,
  UserModalHeaderComponent,
  UserModalBodyComponent,
  UserModalFooterComponent,
];


@NgModule({
  declarations: [...userModalComponents, AuctionHcardComponent, ModalConfirmComponent, UserToasterComponent, FixedFeeProductCardComponent, ViewPdfComponent, DocsCardComponent, OrderSummaryComponent, DrsandFormComponent, CommonListComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [
    ...userModalComponents,
    AuctionHcardComponent,
    ModalConfirmComponent,
    UserToasterComponent,
    FixedFeeProductCardComponent,
    ViewPdfComponent,
    DocsCardComponent,
    OrderSummaryComponent,
    DrsandFormComponent,
    CommonListComponent
  ]
})
export class SharedModule { }
