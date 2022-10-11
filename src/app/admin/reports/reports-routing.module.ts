import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsignmentReportsComponent } from './consignment-reports/consignment-reports.component';
import { TruckReportsComponent } from './truck-reports/truck-reports.component';

// Component

const routes: Routes = [
  {
    path: '',
    component: ConsignmentReportsComponent,
    // children: [
    // ],
  },
  {
    path: 'consignments',
    component: ConsignmentReportsComponent,
  },
  {
    path: 'trucks',
    component: TruckReportsComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporstRoutingModule { }
