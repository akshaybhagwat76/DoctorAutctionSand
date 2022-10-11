import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Module
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from './../shared/shared.module';

// Routing
import { ProfileRoutingModule } from './profile-routing.module';

// Components
import { ProfileComponent } from './profile.component';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProfileModule { }
