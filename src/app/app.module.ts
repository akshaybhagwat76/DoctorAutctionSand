import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterService } from './shared/services/index';
import { ApiAuthHelper } from './guards/api.guard';
import { JwtHelperService } from '@auth0/angular-jwt';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {
  AuthGuardService,
  NonAuthGuardService,
} from './guards/route-auth.guard';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { CommonComponentModule } from './shared/common-component.module';
// import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    NgHttpLoaderModule.forRoot(),
    CommonComponentModule
  ],
  providers: [
    AuthGuardService,
    NonAuthGuardService,
    RegisterService,
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiAuthHelper, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
