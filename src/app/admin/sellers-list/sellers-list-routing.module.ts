import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellersListComponent } from './sellers-list.component';

const routes: Routes = [{ path: '', component: SellersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellersListRoutingModule {}
