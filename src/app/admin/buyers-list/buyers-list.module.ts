import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyersListRoutingModule } from './buyers-list-routing.module';
import { BuyersListComponent } from './buyers-list.component';
import { AdminSharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BuyersListComponent],
  imports: [CommonModule, BuyersListRoutingModule, AdminSharedModule],
  exports: [],
})
export class BuyersListModule {}
