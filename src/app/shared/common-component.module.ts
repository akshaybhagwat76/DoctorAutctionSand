import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToastsComponent } from './components/app-toasts/toast.component'
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppToastsComponent
  ],
  imports: [
    CommonModule,
    NgbToastModule
  ],
  exports: [
    AppToastsComponent
  ],
})
export class CommonComponentModule {}
