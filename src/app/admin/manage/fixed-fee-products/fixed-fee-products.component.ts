import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UrlService } from 'src/app/shared/services/url.service';
declare let $: any;

@Component({
  selector: 'app-fixed-fee-products',
  templateUrl: './fixed-fee-products.component.html',
  styleUrls: ['./fixed-fee-products.component.css']
})
export class FixedFeeProductsComponent implements OnInit {

  isListLoading = false;
  productList: any[] = [];
  productForm: any;
  deleteId:number = 0;
  locationList: any[] = [];
  constructor(
              private adminService: AdminService,
              private fb: FormBuilder,
              public urlService: UrlService) { }

  ngOnInit(): void {
    this.initForm();
    this.listProducts();
    this.listLocation();
  }

  initForm(isnew:any = true) {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      location_id: ['', Validators.required],
      min_order_qty: ['', Validators.required],
      available_qty: ['', Validators.required],
      per_ton_price: ['', [Validators.required,Validators.pattern('[0-9]*')]],
      source: [],
      silt: []
    });
  }

  listLocation() {
    this.adminService.getLocationList().subscribe(
      (success) => {
        this.locationList = success.result;
      },
      (error) => {
        this.locationList = [];
      }
    );
  }

  listProducts() {
    this.isListLoading = true;
    this.adminService.getFixedFeeProducts(`?paginate=true&per_page_records=25`).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        const products = success.result;
        this.productList = products;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.productList = [];
      }
    );
  }

  createProduct() {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    if(this.productForm.value.id) {
      this.adminService.updateFixedFeeProduct(this.productForm.value).subscribe(
        (success) => {
          console.log(success);
          document.getElementById('modal-close-btn')?.click();
          this.initForm();
          this.listProducts();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.adminService.createFixedFeeProduct(this.productForm.value).subscribe(
        (success) => {
          console.log(success);
          document.getElementById('modal-close-btn')?.click();
          this.initForm();
          this.listProducts();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  delete(){
    this.adminService.deleteFixedFeeProduct(this.deleteId).subscribe(
      (success) => {
        $("#confirmModel").modal('hide');
        console.log(success);
        this.listProducts();
        this.deleteId = 0;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteProduct(id: any) {
    this.deleteId = id;
    $("#confirmModel").modal('show');
  }

  onEditBtn(id: any) {
    this.initForm(false);
    let f = this.productList.find(x => x.id == id);
    this.productForm.controls['id'].setValue(id);
    this.productForm.controls['location_id'].setValue(f.location);
    this.productForm.controls['name'].setValue(f.name);
    this.productForm.controls['min_order_qty'].setValue(f.min_order_qty);
    this.productForm.controls['available_qty'].setValue(f.available_qty);
    this.productForm.controls['per_ton_price'].setValue(f.per_ton_price);
    this.productForm.controls['source'].setValue(f.source);
    this.productForm.controls['silt'].setValue(f.silt);
  }

  newProduct(){
    this.initForm();
  }
}
