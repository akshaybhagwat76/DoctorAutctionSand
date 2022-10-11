import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [AdminComponent, LayoutComponent],
  imports: [CommonModule, AdminRoutingModule],
  exports: [LayoutComponent],
})
export class AdminModule {}
