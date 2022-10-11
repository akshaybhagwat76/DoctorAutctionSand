import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

    url = environment.apiBaseUrl;

    constructor(private httpClient:HttpClient){}

    getCityListing(state_id = ''):Observable<any>{
        let url = this.url + 'city-list';
        if(state_id){
            url = url + '?state_id=' + state_id;
        }
        return this.httpClient.get(url);
    }

    getStateList(country_id = ''):Observable<any>{
        let url = this.url + 'state-list';

        if(country_id){
            url = url + '?country_id=' + country_id;
        }

        return  this.httpClient.get(url);
    }

    getCountryList():Observable<any>{
        return this.httpClient.get(this.url+'country-list');
    }

    getGradeList():Observable<any>{
      return this.httpClient.get(this.url+'get-grades');
    }

    getAuProductList():Observable<any>{
      return this.httpClient.get(this.url+'get-auction-products');
    }
    getAuProductListSelect(queryParams: any = ''):Observable<any>{
      return this.httpClient.get(this.url+'get-auction-product-select-list' + queryParams);
    }

    getSandTypeList():Observable<any>{
      return this.httpClient.get(this.url+'get-sand-type-list');
    }

    getTruckSizeList():Observable<any>{
      return this.httpClient.get(this.url+'get-truck-lot-size');
    }

    getProductGradeList(id: any):Observable<any>{
      return this.httpClient.post(this.url+'get-auction_products_grades', {id: id});
    }

    getPaymentDeliveryTermDays():Observable<any>{
      return this.httpClient.get(this.url+'get-payment-delivery-terms');
    }

    getPaymentDeliveryTermDaysByType(type: any):Observable<any>{
      return this.httpClient.get(this.url+'get-payment-delivery-terms-by-type/' + type);
    }

    getTerms():Observable<any>{
      return this.httpClient.get(this.url+'get-static-text');
    }

    extendAuctionTime(id: any):Observable<any>{
      return this.httpClient.post(this.url+'update-auction-time', {auction_id: id});
    }

    getSellerProductList(postData:any):Observable<any>{
      return this.httpClient.post(this.url+'get-seller-products',postData);
    }

    getSellerProductGradeList(postData:any):Observable<any>{
      return this.httpClient.post(this.url+'get-seller-product-grades',postData);
    }

    getProductTypeList():Observable<any>{
      return this.httpClient.get(this.url + 'get-product-types');
    }
}
