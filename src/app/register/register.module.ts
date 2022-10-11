import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { PaymentComponent } from './payment/payment.component';
import { SdPaymentResponseComponent } from './sd-payment-response/sd-payment-response.component';

@NgModule({
  declarations: [RegisterComponent, StepOneComponent, StepTwoComponent, StepThreeComponent, PaymentResponseComponent, PaymentComponent, SdPaymentResponseComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    NgSelectModule, 
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RegisterModule { }
