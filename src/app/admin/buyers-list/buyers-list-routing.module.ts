import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyersListComponent } from './buyers-list.component';

const routes: Routes = [{ path: '', component: BuyersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyersListRoutingModule { }
