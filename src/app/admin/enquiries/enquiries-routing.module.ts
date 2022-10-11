import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnquiriesComponent } from './enquiries/enquiries.component';

// Component

const routes: Routes = [{ path: '', component: EnquiriesComponent }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquiriesRoutingModule { }
