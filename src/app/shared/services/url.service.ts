import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  documentBaseUrl: string = environment.documentsBaseUrl;

  constructor() { }

  documentUrl(user_id:any, file_name: any):string {
    return `${this.documentBaseUrl}/storage/app/public/users/user_${user_id}/${file_name}`;
  }

  registerDocumentUrl(file_name: string):string {
    return `${this.documentBaseUrl}/storage/app/public/users/${file_name}`;
  }

  productDocumentUrl(file_name: string):string {
    // return `${this.documentBaseUrl}/storage/products/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/products/${file_name}`;
  }

  truckDocsUrl(file_name: string):string {
    return `${this.documentBaseUrl}/storage/truck_docs/${file_name}`;
    // return `${this.documentBaseUrl}/storage/app/public/truck_docs/${file_name}`;
  }

  OROCUrl(file_name: string, auction_number: any):string {
    // return `${this.documentBaseUrl}/storage/auctions/auction_no_${auction_number}/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/auctions/auction_no_${auction_number}/${file_name}`;
  }

  buyerOCUrl(file_name: string, auction_number: any):string {
    // return `${this.documentBaseUrl}/storage/auctions/auction_no_${auction_number}/buyer_oc/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/auctions/auction_no_${auction_number}/buyer_oc/${file_name}`;
  }

  DCUrl(file_name: string, auction_number: any, dc_number: any):string {
    // return `${this.documentBaseUrl}/storage/auctions/auction_no_${auction_number}/consignments/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/auctions/auction_no_${auction_number}/consignments/dc_no_${dc_number}/${file_name}`;
  }

  ConsignmentInvoiceUrl(file_name: string, auction_number: any, dc_number: any):string {
    // return `${this.documentBaseUrl}/storage/auctions/auction_no_${auction_number}/consignments/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/auctions/auction_no_${auction_number}/consignments/dc_no_${dc_number}/invoices/${file_name}`;
  }

  //buyer orders attachments
  orderOROCUrl(file_name: string, order_number: any):string {
    // return `${this.documentBaseUrl}/storage/orders/order_no_${order_number}/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/orders/order_no_${order_number}/${file_name}`;
  }

  orderbuyerOCUrl(file_name: string, order_number: any):string {
    // return `${this.documentBaseUrl}/storage/orders/order_no_${order_number}/buyer_oc/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/orders/order_no_${order_number}/buyer_oc/${file_name}`;
  }

  orderDCUrl(file_name: string, order_number: any, dc_number: any):string {
    // return `${this.documentBaseUrl}/storage/orders/order_no_${order_number}/consignments/dc_no_${dc_number}/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/orders/order_no_${order_number}/consignments/dc_no_${dc_number}/${file_name}`;
  }

  orderConsignmentInvoiceUrl(file_name: string, order_number: any, dc_number: any):string {
    // return `${this.documentBaseUrl}/storage/orders/order_no_${order_number}/consignments/dc_no_${dc_number}/invoices/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/orders/order_no_${order_number}/consignments/dc_no_${dc_number}/invoices/${file_name}`;
  }

  orderConsignmentCreditNoteUrl(file_name: string, order_number: any, dc_number: any):string {
    // return `${this.documentBaseUrl}/storage/orders/order_no_${order_number}/consignments/dc_no_${dc_number}/credit_note/${file_name}`;
    return `${this.documentBaseUrl}/storage/app/public/orders/order_no_${order_number}/consignments/dc_no_${dc_number}/credit_note/${file_name}`;
  }
}
