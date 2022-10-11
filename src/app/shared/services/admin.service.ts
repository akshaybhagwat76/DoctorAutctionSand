import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ROLE_ID_BUYER, ROLE_ID_SELLER } from '../constants';
import { AuthService } from './auth.service';

interface SendPaymentLinkPostData {
  user_id: string;
}

interface UploadCertificatePostData {
  user_id: string;
  certificate: any;
}

interface ActivateAccountPostData {
  user_id: string;
}

interface OfflinePaymentPostData{
  user_id:string,
  transaction_id:string,
  payment_remarks:string,
  amount:number,
  tax_amount : number
}

interface UploadDocumentsPostData {
  user_id: string;
  docs: any;
}
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  url = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  generateListUrl({ type, fromDate = '', toDate = '', isAll }: any): string {
    let apiUrl = this.url + 'get-users-list';
    const roleId = type === 'SELLER' ? ROLE_ID_SELLER : ROLE_ID_BUYER;
    apiUrl = apiUrl + '?role_id=' + roleId;

    if (!isAll) {
      apiUrl = `${apiUrl}&fromDate=${fromDate}&toDate=${toDate}`;
    }

    return apiUrl;
  }

  usersList(params: any): Observable<any> {
    const apiUrl = this.generateListUrl(params);
    return this.http.get(apiUrl);
  }

  userDetails(params: any): Observable<any> {
    const apiUrl = `${this.url}user-data/${params.userId}`;
    return this.http.get(apiUrl);
  }

  updateUserMeta(postData: any): Observable<any> {
    return this.http.post(`${this.url}update-user-details`, postData);
  }

  updatePickupDeliveryData(postData: any): Observable<any> {
    return this.http.post(`${this.url}update-user-poc-details`, postData);
  }

  // to send payment link
  sendPaymentLink(postData: SendPaymentLinkPostData): Observable<any> {
    return this.http.post(`${this.url}send-payment-link`, postData);
  }

  // to upload certificate from admin panel
  uploadCertificate(postData: UploadCertificatePostData): Observable<any> {
    return this.http.post(`${this.url}upload-certificate`, postData);
  }

  // to activate account from admin panel
  activateAccount(postData: ActivateAccountPostData): Observable<any> {
    return this.http.post(`${this.url}activate-user`, postData);
  }

  // to deactivate account from admin panel
  deActivateAccount(postData: any): Observable<any> {
    return this.http.post(`${this.url}deactivate-user`, postData);
  }

  validateLogin(): Observable<any> {
    const userData = this.authService.profileData();
    const postData = {
      token: userData && userData.token ? userData.token : '',
    };

    return this.http.post(`${this.url}validate-login-token`, postData);
  }

  createOfflinePayment(postData:OfflinePaymentPostData): Observable<any>{
    return this.http.post(`${this.url}add-offline-payment`, postData);
  }

  createGrade(postData: any): Observable<any>{
    return this.http.post(`${this.url}create-grades`, postData);
  }

  updateGrade(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-grades`, postData);
  }

  deleteGrade(id: any): Observable<any>{
    return this.http.post(this.url+'delete-grades', {id: id});
  }

  createProduct(postData: any): Observable<any>{
    return this.http.post(`${this.url}create-auction-products`, postData);
  }

  updateProduct(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-auction-products`, postData);
  }

  deleteProduct(id: any): Observable<any>{
    return this.http.post(this.url+'delete-auction-products', {id: id});
  }

  createTruckSize(postData: any): Observable<any>{
    return this.http.post(`${this.url}create-truck-lot-size`, postData);
  }

  updateTruckSize(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-truck-lot-size`, postData);
  }

  deleteTruckSize(id: any): Observable<any>{
    return this.http.post(this.url+'delete-truck-lot-size', {id: id});
  }

  createPaymentDeliveryTermDays(postData: any): Observable<any>{
    return this.http.post(`${this.url}create-payment-delivery-terms`, postData);
  }

  deleteTermsDays(id: any): Observable<any>{
    return this.http.post(this.url+'delete-payment-delivery-terms', {id: id});
  }

  updateTerm(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-static-text`, postData);
  }

  createInventory(postData: any): Observable<any>{
    return this.http.post(`${this.url}add-inventory`, postData);
  }

  updateInventory(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-inventory`, postData);
  }

  getInventoryList(postData: any): Observable<any>{
    return this.http.post(this.url+'get-inventory-list', postData);
  }

  getInventoryDetails(postData: any): Observable<any>{
    return this.http.post(this.url+'get-inventory-detail', postData);
  }

  createSellerPincode(postData: any): Observable<any>{
    return this.http.post(`${this.url}add-seller-pincode`, postData);
  }

  updateSellerPincode(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-seller-pincode`, postData);
  }

  getSellerPincodeList(sellerId: any): Observable<any>{
    return this.http.get(this.url+'get-seller-pincodes/' + sellerId);
  }

  deleteSellerPincode(id: any): Observable<any>{
    return this.http.get(this.url+'delete-seller-pincodes/' + id);
  }

  createAuction(postData: any): Observable<any>{
    return this.http.post(`${this.url}create-auction`, postData);
  }

  updateAuction(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-auction`, postData);
  }

  getAuctionDetail(id: any):Observable<any>{
    return this.http.get(this.url+'get-auction-details-for-edit/' + id);
  }

  getAuctionList(postData: any = null): Observable<any>{
    return this.http.post(this.url+'auction-list-admin', postData);
  }

  createPincode(postData: any): Observable<any>{
    return this.http.post(`${this.url}create-pincodes`, postData);
  }

  updatePincode(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-pincodes`, postData);
  }

  getAllPincodeList(): Observable<any>{
    return this.http.get(this.url+'get-pincodes');
  }

  deletePincode(id: any): Observable<any>{
    return this.http.post(this.url+'delete-pincodes', {id: id});
  }

  createLocation(postData: any): Observable<any>{
    return this.http.post(`${this.url}create-location`, postData);
  }

  updateLocation(postData: any): Observable<any>{
    return this.http.post(`${this.url}update-location`, postData);
  }

  getLocationList(): Observable<any>{
    return this.http.get(this.url+'get-location');
  }

  deleteLocation(id: any): Observable<any>{
    return this.http.post(this.url+'delete-location', {id: id});
  }

  getUserListForAuction(postData: any): Observable<any>{
    return this.http.post(this.url+'auction-user-list', postData);
  }

  getAuctionWinners(postData: any): Observable<any>{
    return this.http.post(this.url+'get-winners', postData);
  }


  selectAuctionWinners(postData: any): Observable<any>{
    return this.http.post(this.url+'select-winner', postData);
  }

  sendOR(postData: any): Observable<any>{
    return this.http.post(this.url+'send-or', postData);
  }

  generateOR(postData: any): Observable<any>{
    return this.http.post(this.url+'generate-or', postData);
  }

  approveBuyerOC(postData: any): Observable<any>{
    return this.http.post(this.url+'upprove-buyer-oc', postData);
  }


  // to upload level 2 registration documents from admin panel
  uploadDocuments(postData: UploadDocumentsPostData): Observable<any> {
    return this.http.post(`${this.url}upload-docs`, postData);
  }

  // to send payment link
  sendSDPaymentLink(postData: SendPaymentLinkPostData): Observable<any> {
    return this.http.post(`${this.url}send-payment-link-sd`, postData);
  }

  createConsignment(postData: any): Observable<any>{
    return this.http.post(this.url+'create-consignment', postData);
  }

  updateConsignment(postData: any): Observable<any>{
    return this.http.post(this.url+'update-consignment', postData);
  }

  deleteConsignment(postData: any): Observable<any>{
    return this.http.post(this.url+'delete-consignment', postData);
  }

  getConsignments(id: any): Observable<any>{
    return this.http.get(this.url+'get-auction-consignments?auction_id=' + id);
  }

  getConsignmentDetails(id: any): Observable<any>{
    return this.http.get(this.url+'get-consignment-details?consignment_id=' + id);
  }

  getLatestBids(id:any):Observable<any>{
    return this.http.get(this.url+'get-bid-admin?id='+id);
  }

  generateDC(consignment_id: any):Observable<any>{
    return this.http.get(this.url+'generate-dc?consignment_id='+ consignment_id);
  }

  updateAcceptedConsignment(postData: any): Observable<any>{
    return this.http.post(this.url+'update-accepted-consignment', postData);
  }

  updateNumberOfConsignment(postData: any): Observable<any>{
    return this.http.post(this.url+'update-number-of-consignment', postData);
  }

  releaseBuyerSD(postData: any): Observable<any>{
    return this.http.post(this.url+'release-buyer-sd', postData);
  }

  addMinutes(date: any, minutes: any) {
    return new Date(date.getTime() + minutes*60000);
  }

  formatDateTime(time: any) {
    let date = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    date = (date < 10) ? "0" + date : date;
    month = (month < 10) ? "0" + month : month;

    let formattedDate = year + '-' + month + '-' + date + 'T' + h + ':' + m + ':' + s;
    return formattedDate;
  }


  // getFixedFeeProducts():Observable<any>{
  //   return this.http.get(this.url+'get-fixed-fee-products');
  // }

  getFixedFeeProducts(queryString:string):Observable<any>{
    return this.http.get(this.url+'get-sale-product-list' + queryString);
  }
  createFixedFeeProduct(postData: any): Observable<any>{
    return this.http.post(this.url+'create-sale-product', postData);
  }

  updateFixedFeeProduct(postData: any): Observable<any>{
    return this.http.put(this.url+'update-sale-product/'+ postData.id , postData);
  }

  deleteFixedFeeProduct(id: any): Observable<any>{
    return this.http.delete(this.url+'delete-sale-product/' + id);
  }

  getFixedFeeProductById(id:any): Observable<any>{
    return this.http.get(this.url+'get-sale-product-list?fixed_fee_product_id=' + id);
  }

  getFixedPriceSellerList(postData: any): Observable<any>{
    return this.http.post(this.url+'fixed-price-seller-list', postData);
  }

  notifySellerAboutOrder(postData: any): Observable<any>{
    return this.http.post(this.url+'order-notify-seller', postData);
  }

  holdOrder(postData: any): Observable<any>{
    return this.http.post(this.url+'hold-unhold-order', postData);
  }


  // createFixedFeeProduct(postData: any): Observable<any>{
  //   return this.http.post(this.url+'create-fixed-fee-products', postData);
  // }

  // updateFixedFeeProduct(postData: any): Observable<any>{
  //   return this.http.post(this.url+'update-fixed-fee-products', postData);
  // }

  // deleteFixedFeeProduct(postData: any): Observable<any>{
  //   return this.http.post(this.url+'delete-fixed-fee-products', postData);
  // }

  updateCreditLimit(postData: any):Observable<any>{
    return this.http.post(this.url + 'update-credit-limit', postData);
  }

  getConsignmentReports(queryParams: any): Observable<any>{
    return this.http.get(this.url+'get-consignment-level-reports' + queryParams);
  }

  getTruckReports(queryParams: any): Observable<any>{
    return this.http.get(this.url+'get-truck-level-reports' + queryParams);
  }

  exportConsignmentReports(queryParams: any): Observable<any>{
    return this.http.get(this.url+'export-consignment-level-reports' + queryParams, {responseType: 'blob'});
  }

  exportTruckReports(queryParams: any): Observable<any>{
    return this.http.get(this.url+'export-truck-level-reports' + queryParams, {responseType: 'blob'});
  }

  exportBothReports(queryParams: any): Observable<any>{
    return this.http.get(this.url+'export-both-reports' + queryParams, {responseType: 'blob'});
  }

  addEnquiryNotes(postData: any): Observable<any>{
    return this.http.post(this.url+'add-enquiry-notes', postData);
  }

  getEnquiryNotes(queryParams: any): Observable<any>{
    return this.http.get(this.url+'get-enquiry-notes' + queryParams);
  }

  getEnquiries(queryParams: any): Observable<any>{
    return this.http.get(this.url+'get-enquiries' + queryParams);
  }

}
