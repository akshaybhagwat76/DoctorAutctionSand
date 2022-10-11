import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { EpassbookComponent } from "./epassbook.component";
import { TransactionComponent } from "./transaction/transaction.component";

const routes: Routes = [
  {
    path: "",
    component: EpassbookComponent,
  },
  {
    path: "transaction/:transactionId",
    component: TransactionComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EpassbookRoutingModule { }
