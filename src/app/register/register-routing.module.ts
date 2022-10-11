import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';
import { StepOneComponent } from "./step-one/step-one.component";
import { StepTwoComponent } from "./step-two/step-two.component";
import { StepThreeComponent } from './step-three/step-three.component';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { PaymentComponent } from './payment/payment.component';
import { SdPaymentResponseComponent } from './sd-payment-response/sd-payment-response.component';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'step-one/:token', component: StepOneComponent },
  { path: 'step-two', component: StepTwoComponent },
  { path: 'step-three', component: StepThreeComponent },
  { path: 'payment/:token', component: PaymentComponent },
  { path: 'success', component: PaymentResponseComponent },
  { path: 'failed', component: PaymentResponseComponent },
  {path:'security-deposit/:resp',component:SdPaymentResponseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
