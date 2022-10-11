import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsignmentReportsComponent } from './consignment-reports/consignment-reports.component';
import { ReporstRoutingModule } from './reports-routing.module';
import { TruckReportsComponent } from './truck-reports/truck-reports.component';



@NgModule({
  declarations: [ConsignmentReportsComponent, TruckReportsComponent],
  imports: [
    CommonModule,
    ReporstRoutingModule,
  ]
})
export class ReportsModule { }
