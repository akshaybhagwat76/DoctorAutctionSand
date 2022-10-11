import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBuyerAuctions(postData: any): Observable<any> {
    return this.http.post(this.url + 'get-buyer-auctions', postData);
  }

  getAuctionDetail(id: any):Observable<any>{
    return this.http.get(this.url+'get-auction-details/' + id);
  }

  getUserAddressList(params: string = ''):Observable<any>{
    return this.http.get(this.url+'get-address' + params);
  }
  getAuctionDetailForBid(id: any):Observable<any>{
    return this.http.get(this.url+'get-auction-bid-details/' + id);
  }

  getLatestBids(id:any):Observable<any>{
    return this.http.get(this.url+'get-bid?id='+id);
  }

  getResult(id:any):Observable<any>{
    return this.http.get(this.url+'get-result?auction_id='+id);
  }

  createBid(postData:any):Observable<any>{
    return this.http.post(this.url+'place-bid',postData);
  }

  getStaticText():Observable<any>{
    return this.http.get(this.url+'get-static-text');
  }

  checkServiceLocation(postData:any):Observable<any>{
    return this.http.post(this.url+'check-service-location',postData);
  }

  checkFixedFeeServiceLocation(postData:any):Observable<any>{
    return this.http.post(this.url+'check-fixed-fee-service-location',postData);
  }

  createAuctionBider(postData:any):Observable<any>{
    return this.http.post(this.url+'create-auction-biders',postData);
  }

  checkPassbookAmount(postData:any):Observable<any>{
    return this.http.post(this.url+'validate-amount',postData);
  }

  buyerToConfirm(postData:any):Observable<any>{
    return this.http.post(this.url+'get-buyer-to-confirm',postData);
  }

  confirmResponse(postData:any):Observable<any>{
    return this.http.post(this.url+'confirm-or-seller-response',postData);
  }

  orderConfirmSeller(postData:any):Observable<any>{
    return this.http.post(this.url+'order-confirm-seller',postData);
  }

  orderConfirmBuyer(postData:any):Observable<any>{
    return this.http.post(this.url+'order-confirm-buyer',postData);
  }

  confirmORResponseBuyer(postData:any):Observable<any>{
    return this.http.post(this.url+'confirm-or-buyer-response',postData);
  }

  generateOC(postData:any):Observable<any>{
    return this.http.post(this.url+'generate-oc',postData);
  }

  uploadBuyerOC(postData:any):Observable<any>{
    return this.http.post(this.url+'upload-buyer-oc',postData);
  }

  uploadBuyerOrderOC(postData:any):Observable<any>{
    return this.http.post(this.url+'upload-buyer-order-oc',postData);
  }

  sendOC(postData:any):Observable<any>{
    return this.http.post(this.url+'send-oc',postData);
  }

  confirmOCSellerResponse(postData:any):Observable<any>{
    return this.http.post(this.url+'confirm-oc-seller-response',postData);
  }

  getTransactions():Observable<any>{
    return this.http.get(this.url+'sd-transactions');
  }

  getPassbookBalance():Observable<any>{
    return this.http.get(this.url+'passbook-balance');
  }

  createRPOrder(postData:any):Observable<any>{
    return this.http.post(this.url+'create-rp-order',postData);
  }

  verifyPaymentSignatureSD(postData:any):Observable<any>{
    return this.http.post(this.url+'add-passbook-amount',postData);
  }

  verifyPaymentSignatureBuyerOrder(postData:any):Observable<any>{
    return this.http.post(this.url+'verify-place-order-rp',postData);
  }

  getServiceablePincodes(auction_id:number):Observable<any>{
    return this.http.get(this.url+'serviceable-pincodes/'+auction_id);
  }

  getInvoices(consignmentId:number):Observable<any>{
    return this.http.get(this.url+'invoice-by-consignment/'+consignmentId);
  }

  createRPOrderInvoice(postData:any):Observable<any>{
    return this.http.post(this.url+'create-rp-order-invoice',postData);
  }

  verifyPaymentSignatureInvoice(postData:any):Observable<any>{
    return this.http.post(this.url+'invoice-payment',postData);
  }

  offlinePayment(postData:any):Observable<any>{
    return this.http.post(this.url+'offline-payment',postData);
  }

  generateInvoicesForConsifnment(postData:any):Observable<any>{
    return this.http.post(this.url+'generate-invoices',postData);
  }

  getConsignments(id: any): Observable<any>{
    return this.http.get(this.url+'get-auction-consignments?auction_id=' + id);
  }

  //buyerOrders
  addToCart(postData:any):Observable<any>{
    return this.http.post(this.url+'add-to-cart', postData);
  }

  removeFromCart(postData:any):Observable<any>{
    return this.http.post(this.url+'remove-from-cart', postData);
  }

  getCartData(queryString:string):Observable<any>{
    return this.http.get(this.url + 'cart-list' + queryString);
  }

  placeOrder(postData:any):Observable<any>{
    return this.http.post(this.url+'place-order',postData);
  }

  getUserOrders(queryString:string):Observable<any>{
    return this.http.get(this.url + 'buyer-orders' + queryString);
  }

  getUserOrderDetails(orderId:any):Observable<any>{
    return this.http.get(this.url + 'buyer-order-details/' + orderId);
  }

  getConsignmentList(queryParanms: any):Observable<any>{
    return this.http.get(this.url + 'get-consignments' + queryParanms);
  }

  getUserOrderMasterStatusList():Observable<any>{
    return this.http.get(this.url + 'buyer-orders-master-status-list');
  }

  scheduleConsignmnet(postData:any):Observable<any>{
    return this.http.post(this.url+'create-order-consignment',postData);
  }

  approveConsignmnet(postData:any):Observable<any>{
    return this.http.post(this.url+'approve-consignment',postData);
  }

  getTrucks(consignmentId:any):Observable<any>{
    return this.http.get(this.url+'get-truck-list/' + consignmentId);
  }

  addTruck(postData:any):Observable<any>{
    return this.http.post(this.url+'add-truck-details',postData);
  }
  updateTruck(postData:any):Observable<any>{
    return this.http.post(this.url+'update-truck-details', postData);
  }

  generateCreditNote(postData:any):Observable<any>{
    return this.http.post(this.url+'create-credit-note',postData);
  }

  generateOrderTruckInvoice(postData:any):Observable<any>{
    return this.http.post(this.url+'generate-order-truck-invoice',postData);
  }
  generateOrderTruckDC(postData:any):Observable<any>{
    return this.http.post(this.url+'generate-order-truck-invoice-dc',postData);
  }

  makeBuyerOrderPayment(postData:any):Observable<any>{
    return this.http.post(this.url+'make-payment',postData);
  }

  verifyPaymentSignatureBuyerOrderConsignmentLevel(postData:any):Observable<any>{
    return this.http.post(this.url+'verify-payment',postData);
  }

  offlinePaymentBuyerOrder(postData:any):Observable<any>{
    return this.http.post(this.url+'offline-payment-buyer-order',postData);
  }
}
