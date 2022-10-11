import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  url = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  sendPhoneOtp(postData: any): Observable<any> {
    return this.http.post(this.url + 'sendOtpToMobile', postData);
  }

  sendEmailOtp(postData: any): Observable<any> {
    return this.http.post(this.url + 'sendOtpToEmail', postData);
  }

  verifyPaymentSignature(postData: any): Observable<any> {
    return this.http.post(this.url + 'verify-rp-payment-signature', postData);
  }
  makeOrder(postData: any): Observable<any> {
    return this.http.post(this.url + 'make-order', postData);
  }
  validateCoupon(postData: any): Observable<any> {
    return this.http.post(this.url + 'validate-coupon', postData);
  }

  update_poc_details(formValue: any): Observable<any> {
    let post_url = this.url + 'update-pickup-delivery-data';
    return this.http.post(post_url, formValue);
  }

  getPickupData():Observable<any>{
    return this.http.get(this.url + 'get-user-poc-details');
  }
  // getSaleData(query = '', report_type = ''): Observable<any> {
  //   if (report_type == 'topups') {
  //     return this.http.get(environment.apiBaseUrl + 'recharge_sale_data' + query);
  //   } else {
  //     return this.http.get(this.url + '/show' + query);
  //   }
  // }

  getUserDetails(query = ''): Observable<any> {
    let url = this.url + 'get-user-poc-details' + query;
    return this.http.get(url);
  }

  verifyOtp(postData: any): Observable<any> {
    return this.http.post(this.url + 'verifyOtp', postData);
  }

  register(postData: any): Observable<any> {
    return this.http.post(this.url + 'registerUser', postData);
  }
  validateToken(postData: any): Observable<any> {
    return this.http.post(this.url + 'validate-login-token', postData);
  }
  submitStepOne(formValue: any): Observable<any> {
    let post_url = this.url + 'update-user-meta-data';
    return this.http.post(post_url, formValue);
  }
  getRegAmount(): Observable<any> {
    return this.http.get(this.url + 'get-registration-amount');
  }  
  sdAmountByToken(postData: any): Observable<any> {
    return this.http.post(this.url + 'sd-amount-by-token', postData);
  }
  
  makeOrderForSD(postData: any): Observable<any> {
    return this.http.post(this.url + 'make-order-sd', postData);
  }

  verifyPaymentSignatureSD(postData: any): Observable<any> {
    return this.http.post(this.url + 'verify-rp-payment-signature-sd', postData);
  }
}
