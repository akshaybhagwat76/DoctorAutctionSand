import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EpassbookRoutingModule } from './epassbook-routing.module';
import { TransactionComponent } from './transaction/transaction.component';
import{EpassbookComponent} from './epassbook.component';


@NgModule({
  declarations: [EpassbookComponent,TransactionComponent],
  imports: [
    CommonModule,
    EpassbookRoutingModule
  ]
})
export class EpassbookModule { }
