import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
} from './components/modal/modal.component';
import { RegDetailsComponent } from './components/reg-details/reg-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ServiceablePincodesComponent } from './components/serviceable-pincodes/serviceable-pincodes.component';
import { SellersProductsComponent } from './components/sellers-products/sellers-products.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { AuctionHcardAdminComponent } from './components/auction-hcard-admin/auction-hcard-admin.component';
import { BidTableComponent } from './components/bid-table/bid-table.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { AcceptedDcComponent } from './components/accepted-dc/accepted-dc.component';
import { ConsignmentInvoiceComponent } from './components/consignment-invoice/consignment-invoice.component';
import { AdminCommonListComponent } from './components/common-list/common-list.component';
import { AdminDocsCardComponent } from './components/docs-card/docs-card.component';
import { AdminDrsandFormComponent } from './components/drsand-form/drsand-form.component';
import { AdminOrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AdminViewPdfComponent } from './components/view-pdf/view-pdf.component';
import { CreateFixedPriceProductComponent } from './components/create-fixed-price/create-fixed-price-product.component'
const modalComponents = [
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
];

@NgModule({
  declarations: [
    ListComponent,
    RegDetailsComponent,
    ...modalComponents,
    ServiceablePincodesComponent,
    SellersProductsComponent, ToasterComponent,
    AuctionHcardAdminComponent,
    BidTableComponent,
    ConfirmationModalComponent,
    AcceptedDcComponent,
    ConsignmentInvoiceComponent,
    AdminCommonListComponent,
    AdminDocsCardComponent,
    AdminDrsandFormComponent,
    AdminOrderSummaryComponent,
    AdminViewPdfComponent,
    CreateFixedPriceProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule],
  exports: [
    ListComponent,
    RegDetailsComponent,
    ...modalComponents,
    ServiceablePincodesComponent,
    SellersProductsComponent,
    ToasterComponent,
    AuctionHcardAdminComponent,
    BidTableComponent,
    ConfirmationModalComponent,
    AcceptedDcComponent,
    ConsignmentInvoiceComponent,
    AdminCommonListComponent,
    AdminDocsCardComponent,
    AdminDrsandFormComponent,
    AdminOrderSummaryComponent,
    AdminViewPdfComponent,
    CreateFixedPriceProductComponent
  ],
})
export class AdminSharedModule {}
