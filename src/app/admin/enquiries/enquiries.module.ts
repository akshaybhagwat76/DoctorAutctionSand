import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { EnquiriesRoutingModule } from './enquiries-routing.module';
import { EnquiriesComponent } from './enquiries/enquiries.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [EnquiriesComponent],
  imports: [
    CommonModule,
    EnquiriesRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbPopoverModule
  ],
  exports: [],
})
export class EnquiriesModule { }
