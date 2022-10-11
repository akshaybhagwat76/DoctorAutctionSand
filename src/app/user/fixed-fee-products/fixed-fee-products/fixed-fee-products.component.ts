import { Component, OnInit } from '@angular/core';
import { SAND_BULK, SUPPLEMNETRY, SAND_BAG } from 'src/app/shared/constants';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-fixed-fee-products',
  templateUrl: './fixed-fee-products.component.html',
  styleUrls: ['./fixed-fee-products.component.css']
})
export class FixedFeeProductsComponent implements OnInit {
  user: any;
  productList:any[] = [];
  currentPage:number = 1;
  per_page_records = 25;
  totalProducts:number  = 0;
  productType = {
    sand_bulk: SAND_BULK,
    supllementry: SUPPLEMNETRY,
    sand_bag: SAND_BAG
  };
  constructor(private _adminService: AdminService) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('doctor-sand-user');
    this.user = JSON.parse(user);

    this.loadProductList(this.productType.sand_bulk);
  }

  loadProductList(productType: any = ''){
    this._adminService.getFixedFeeProducts(`?paginate=true&page=1&per_page_records=50&product_type=` + productType)
        .subscribe(success => {

          let {data, current_page, total } = success.result;
          this.productList = data;
          this.currentPage = current_page;
          this.totalProducts = total;

        },error => {
          console.log(error);
        })
  }

}
