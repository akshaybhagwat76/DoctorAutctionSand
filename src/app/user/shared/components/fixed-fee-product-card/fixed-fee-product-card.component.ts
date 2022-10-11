import { Component, Input, OnInit } from '@angular/core';
import { SAND_BULK, SUPPLEMNETRY, SAND_BAG } from 'src/app/shared/constants';
import { UrlService } from 'src/app/shared/services/url.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-fixed-fee-product-card',
  templateUrl: './fixed-fee-product-card.component.html',
  styleUrls: ['./fixed-fee-product-card.component.css']
})
export class FixedFeeProductCardComponent implements OnInit {
  @Input('product') product:any;
  user: any;
  imageBaseUrl = environment.documentsBaseUrl;
  productType = {
    sand_bulk: SAND_BULK,
    supllementry: SUPPLEMNETRY,
    sand_bag: SAND_BAG
  };
  constructor(public urlService: UrlService) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('doctor-sand-user');
    this.user = JSON.parse(user);
  }

}
