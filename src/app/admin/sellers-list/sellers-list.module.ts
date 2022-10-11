import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellersListRoutingModule } from './sellers-list-routing.module';
import { SellersListComponent } from './sellers-list.component';
import { AdminSharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SellersListComponent],
  imports: [CommonModule, SellersListRoutingModule, AdminSharedModule],
  exports: [],
})
export class SellersListModule {}
