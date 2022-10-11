import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UrlService } from 'src/app/shared/services/url.service';
declare let $: any;

@Component({
  selector: 'app-fixed-fee-products',
  templateUrl: './fixed-fee-products-list.component.html',
  styleUrls: ['./fixed-fee-products-list.component.css']
})
export class FixedFeeProductsListComponent implements OnInit {

  isListLoading = false;
  productList: any[] = [];
  productForm: any;
  deleteId:number = 0;
  pincodesList: any[] = [];
  deleteProductName: any = '';
  modalData: any = {};
  modalId: any;
  isModalAddProductOpen: boolean = false;
  selectedProductId: any;
  constructor(
              private adminService: AdminService,
              private fb: FormBuilder,
              private _router : Router,
              public urlService: UrlService) { }

  ngOnInit(): void {
    // this.initForm();
    this.listProducts();
    // this.listPincodes();
  }

  handleModalOpenClick(e: any = null) {
    this.selectedProductId = e;
    this.isModalAddProductOpen = true;
  }
  handleModalClose(e: any) {
    if (e && e.refresh) {
      this.listProducts();
    }
    this.isModalAddProductOpen = false;
  }

  // initForm(isnew:any = true) {
  //   this.productForm = this.fb.group({
  //     id: [''],
  //     seller_id : ['', Validators.required],
  //     pincodes : ['', Validators.required],
  //     product_name: ['', Validators.required],
  //     grades : ['', Validators.required],
  //     truck_size :  ['', Validators.required],
  //     lot_size : ['', Validators.required],
  //     price : ['', Validators.required],
  //     // location_id: ['', Validators.required],
  //     min_order_qnty: ['', Validators.required],
  //     source: [],
  //     slit: [],
  //     payment_terms : ['', Validators.required],
  //     delivery_terms : ['', Validators.required]
  //     // available_qty: ['', Validators.required],
  //     // per_ton_price: ['', [Validators.required,Validators.pattern('[0-9]*')]],
  //   });
  // }

  // listPincodes() {
  //   this.adminService.getAllPincodeList().subscribe(
  //     (success) => {
  //       this.pincodesList = success.result;
  //     },
  //     (error) => {
  //       this.pincodesList = [];
  //     }
  //   );
  // }

  listProducts() {
    this.isListLoading = true;
    this.adminService.getFixedFeeProducts(`?paginate=true&per_page_records=25`).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        const products = success.result.data;
        this.productList = products;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.productList = [];
      }
    );
  }

  // createProduct() {
  //   if(this.productForm.invalid) {
  //     this.productForm.markAllAsTouched();
  //     return;
  //   }
  //   if(this.productForm.value.id) {
  //     this.adminService.updateFixedFeeProduct(this.productForm.value).subscribe(
  //       (success) => {
  //         console.log(success);
  //         document.getElementById('modal-close-btn')?.click();
  //         this.initForm();
  //         this.listProducts();
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   } else {
  //     this.adminService.createFixedFeeProduct(this.productForm.value).subscribe(
  //       (success) => {
  //         console.log(success);
  //         document.getElementById('modal-close-btn')?.click();
  //         this.initForm();
  //         this.listProducts();
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   }
  // }

  deleteProduct(){
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

  onDeleteProductClick(id: any, name: any) {
    this.deleteId = id;
    this.modalId = 'confirmDeleteModel';
    this.modalData.text = `Are you sure you want to remove ${name} ?`
    this.modalData.title = `Remove ${name}`;
    $('#' + this.modalId).modal('show');
  }

  confirmDeleteModalResponse(res: boolean) {
    if(res) {
      this.deleteProduct();
    }
  }

  onEditBtn(id:any){
    this._router.navigateByUrl(`/admin/fixed-fee-products/edit/${id}`);
  }
  // onEditBtn(id: any) {
  //   this.initForm(false);
  //   let f = this.productList.find(x => x.id == id);
  //   let pincodes = f.pincodes.map((p:any) => p.id);
  //   this.productForm.controls['id'].setValue(id);
  //   this.productForm.controls['seller_id'].setValue(f.seller_id);
  //   this.productForm.controls['pincodes'].setValue(pincodes);
  //   this.productForm.controls['product_name'].setValue(f.product_name);
  //   this.productForm.controls['grades'].setValue(f.grades);
  //   this.productForm.controls['truck_size'].setValue(f.truck_size);
  //   this.productForm.controls['lot_size'].setValue(f.lot_size);
  //   this.productForm.controls['price'].setValue(f.price);
  //   this.productForm.controls['min_order_qnty'].setValue(f.min_order_qnty);
  //   this.productForm.controls['source'].setValue(f.source);
  //   this.productForm.controls['slit'].setValue(f.slit);
  //   this.productForm.controls['payment_terms'].setValue(f.payment_terms);
  //   this.productForm.controls['delivery_terms'].setValue(f.delivery_terms);

  // }

  // newProduct(){
  //   this.initForm();
  // }
}
