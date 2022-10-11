import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import * as moment from 'moment';

declare let $: any;
@Component({
  selector: 'app-create-fixed-fee-component',
  templateUrl: './create-fixed-fee-product.component.html',
  styleUrls: ['./create-fixed-fee-product.component.css']
})
export class CreateFixedFeeProductComponent implements OnInit {

  gradeList: any[] = [];
  productList: any[] = [];
  truckSizeList: any[] = [];
  sellerList: any[] = [];
  sellerListTemp: any[] = [];
  paymentTermList: any[] = [];
  deliveryTermList: any[] = [];
  locationList: any[] = [];
  sellerPincodesList: any[] = [];
  productForm: any;
  autocompleteInput: any;
  isAutocompleteShown = false;
  autocompleteData: any[] = [];
  autocompleteDataTemp: any[] = [];
  currentValue: any;
  selectedBuyers: any[] = [];
  buyersList: any[] = [];

  selectedSeller: any = { product_type  : 2};
  sellerName = new FormControl();

  toastBody: any;
  toastTitle: any;
  toastType: any;

  title:string = 'Create Fixed Fee Product';
  paramId:any = '';

  sdAmt:any='';
  security_deposit_type: any[] = [{name: 'Flat Amount', value: 'amt'},
  {name: 'Percentage', value: 'percent'}];

  productTax = 1;
  currentDate = new Date();

  constructor(private listingService: ListingService,
              private adminService: AdminService,
              private fb: FormBuilder,
              private el: ElementRef,
              private _router :Router) { }

  ngOnInit(): void {

    let currentUrl = this._router.url;
    this.paramId = '';
    if(currentUrl.includes('edit')){
      this.paramId = currentUrl.split('/')[4];
      this.title = 'Edit Fixed Fee Product';
    }
    this.listTruckSize();
 
    this.listPaymentTerms('payment');
    this.listDeliveryTerms('delivery');
    this.listLocation();
    this.initForm();
    if(this.paramId){
      this.getProductDetail(this.paramId);
    }
    // this.listBuyers();
    this.listUsersForAuction(2);
    this.listUsersForAuction(1);
  }

  initForm() {
    this.productForm = this.fb.group({
      id: [''],
      product_number : [''],
      seller_id: ['', Validators.required],
      product_id : ['', Validators.required],
      grade_id: ['', Validators.required],
      truck_size_id: ['', Validators.required],
      lot_size: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,3})?$")]],
      pincodes: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      min_order_qnty: ['1', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      payment_term_id: ['', Validators.required],
      delivery_term_id: ['', Validators.required],
      source: [''],
      silt: [''],
      microns : ['']
    });
  }


  getProductDetail(id:any){
      this.adminService.getFixedFeeProductById(id).subscribe((success:any) => {
        let product = success.result ? success.result: {};
        this.patchForm(product);
      },(error:any) =>{
        console.log(error);
      });
  }

  patchForm(product:any){

    let pincodes = product.pincodes.map((pin:any) => pin.id);
    this.productForm.patchValue({
      id : product.id,
      product_number : product.product_number,
      seller_id : product.seller_id,
      product_id : product.product_id,
      grade_id : product.grade_id,
      truck_size_id : product.truck_size_id,
      lot_size : product.lot_size,
      price : product.price,
      min_order_qnty : product.min_order_qnty,
      source : product.source,
      silt : product.silt, 
      microns : product.microns || '',
      pincodes : pincodes,
      payment_term_id  : product.payment_term_id,
      delivery_term_id : product.delivery_term_id
    });

    $('#product_name').val(product.product.name);
    $('#grade').val(product.grade.grade);
    this.sellerName.setValue(product.seller.name);
    this.listSellersPincodes(product.seller_id);
    this.selectedSeller.product_type = product.product.product_type;
  }

  onProductChange(e: any) {
    this.productTax = e.tax;
    this.listGrades(e.id);
  }

  onSellerChange(e: any) {
    // this.listSellersPincodes(e.id);
    this.productForm.controls['seller_id'].setValue(this.selectedSeller.id);
    this.listSellersPincodes(this.productForm.value.seller_id);
    this.sellerName.setValue(this.selectedSeller.name);
    // this.productForm.controls['available_inventory'].setValue(this.selectedSeller.total);
    this.productForm.controls['product_id'].setValue(this.selectedSeller.product_id);
    this.productForm.controls['grade_id'].setValue(this.selectedSeller.grade_id);
    $('#grade').val(this.selectedSeller.grade);
    $('#product_name').val(this.selectedSeller.product_name);
    // this.listProducts();
    // this.listGrades(this.selectedSeller.product_id);
    // this.productTax = this.selectedSeller.tax;
    // this.calcPrice();
  }

  onSellerRadioChange(e: any) {
    this.selectedSeller = e;
  }

  listGrades(id: any) {
    
    let date = this.productForm.get('from_datetime').value;
    let seller_id = this.productForm.get('seller_id').value;
    if(!date){
      date = new Date();
    }
    this.listingService.getSellerProductGradeList({id,date,seller_id}).subscribe(
      (success) => {
        this.gradeList = success.result;
      },
      (error) => {
        this.gradeList = [];
      }
    );
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

  listSellersPincodes(sellerId: any) {
    this.adminService.getSellerPincodeList(sellerId).subscribe(
      (success) => {
        let obj = {
          id : 0,
          pincode : "All"
        };
        this.sellerPincodesList = [];
        this.sellerPincodesList.push(obj);
        success.result.forEach((element:any) => {
          this.sellerPincodesList.push({id:element.pincode_id,pincode :element.pincode})
        });
      },
      (error) => {
        this.sellerPincodesList = [];
      }
    );
  }

  listUsersForAuction(roleId: any) {
    this.adminService.getUserListForAuction({role_id: roleId}).subscribe(
      (success) => {
        if(roleId === 2) {
          this.sellerList = success.result;
          this.sellerListTemp = success.result;
        } else {
          this.buyersList = success.result;
        }
      },
      (error) => {
        this.sellerList = [];
        this.buyersList = [];
      }
    );
  }

  listPaymentTerms(type: any) {
    this.listingService.getPaymentDeliveryTermDaysByType(type).subscribe(
      (success) => {
        this.paymentTermList = success.result;
      },
      (error) => {
        this.paymentTermList = [];
      }
    );
  }

  listDeliveryTerms(type: any) {
    this.listingService.getPaymentDeliveryTermDaysByType(type).subscribe(
      (success) => {
        this.deliveryTermList = success.result;
      },
      (error) => {
        this.deliveryTermList = [];
      }
    );
  }

  listProducts() {
    let date = this.productForm.get('from_datetime').value;
    let seller_id = this.productForm.get('seller_id').value;
    if(!date){
      date = new Date();
    }
    this.listingService.getSellerProductList({date:date,seller_id:seller_id}).subscribe(
      (success) => {
        this.productList = success.result;
        success.result.forEach((element: any) => {
          if(this.selectedSeller.product_id == element.id) {
            this.productTax = element.tax;
          }
        });
        console.log(this.productTax);
      },
      (error) => {
        this.productList = [];
      }
    );
  }

  listTruckSize() {
    this.listingService.getTruckSizeList().subscribe(
      (success) => {
        this.truckSizeList = success.result;
      },
      (error) => {
        this.truckSizeList = [];
      }
    );
  }

  listSellers() {
    // this.isListLoading = true;
    this.adminService
      .usersList({
        type: 'SELLER'
        // fromDate: this.fromDate
        //   ? this.datePipe.transform(this.fromDate, 'YYYY-MM-dd HH:mm')
        //   : '',
        // toDate: this.toDate
        //   ? this.datePipe.transform(this.toDate, 'YYYY-MM-dd HH:mm')
        //   : '',
        // isAll: this.isAll,
      })
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.sellerList = res.result;
            this.sellerListTemp = res.result
          } else {
            this.sellerList = [];
            this.sellerListTemp = [];
          }
          // this.isListLoading = false;
        },
        (err) => {
          this.sellerList = [];
          this.sellerListTemp = [];
          // this.isListLoading = false;
        }
      );
  }


  onAutocompleteKeypress(event: any){
    // if below key are pressed then avoid debounce and pass it to autocomplete function
    // up = 38; down = 40; enter = 13; tab = 9; escape = 27;
    if([38, 40, 13, 9, 27].includes(event.keyCode)){
      this.autocomplete(event);
      // return false;
    } else {
      this.autocomplete(event);
    }
  }

  setValue(val: any){
    this.autocompleteInput = val.name;
    this.isAutocompleteShown = false;
    // this.onItemSelect.emit(this.autocompleteInput);
  }

  autocomplete(event: any){
    const up = 38;
    const down = 40;
    const enter = 13;
    const tab = 9;
    const escape = 27;
    const value = event.target.value;
    const listItem = document.querySelectorAll('.autocomplete-list li');
    if (value == null || value == '' || value == ' ') {
      this.currentValue = -1;
      this.autocompleteData = this.buyersList;
      this.isAutocompleteShown = false;
    } else {
      this.filterAutocomplete(this.autocompleteInput);
      this.isAutocompleteShown = true;
      if (event.keyCode == up && this.currentValue > 0) {
        this.currentValue--;
        event.target.value = this.autocompleteData[this.currentValue];
        listItem[this.currentValue].scrollIntoView(true);
      }
      if (event.keyCode == down && this.currentValue < this.autocompleteData.length - 1) {
        this.currentValue++;
        event.target.value = this.autocompleteData[this.currentValue];
        listItem[this.currentValue].scrollIntoView(true);
      }
      if (event.keyCode == enter || event.keyCode == tab || event.keyCode == escape) {
        this.autocompleteInput = event.target.value;
        this.isAutocompleteShown = false;
      }
    }
  }

  filterAutocomplete(value: any) {
    const arr = this.buyersList;
    const result = arr.filter((item: any) => item.name.toLowerCase().includes(value.toLowerCase()));
    this.autocompleteData = result;
  }

  filterAutocompleteForSeller(e: any) {
    const arr = this.sellerList;
    const result = arr.filter((item: any) => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
    this.sellerListTemp = result;
  }

  createFixedFeeProduct() {
    let pincodes = this.productForm.get('pincodes').value;
    if(pincodes.includes(0)){
      var pincodeArray:any = [];
      this.sellerPincodesList.forEach((e:any)=>{
        if(e.id != 0){
          pincodeArray.push(e.id);
        }
      })
      this.productForm.controls['pincodes'].setValue(pincodeArray);
    }
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
   
    this.adminService.createFixedFeeProduct(this.productForm.value).subscribe(
      (success) => {
        if(success.success) {
          this.toastBody = success.error.message;
          this.toastTitle = 'Success';
          this.toastType = 1;
          $('#my-toast').toast('show');
          setTimeout(() => {
            this._router.navigate(['/admin/fixed-fee-products/list']);
          }, 500);
        } else {
          this.toastBody = success.error.message;
          this.toastTitle = 'Error';
          this.toastType = 2;
          $('#my-toast').toast('show');
        }
        // this.initForm();
        // this.listProducts();
      },
      (error) => {
        this.toastBody = error.message;
        this.toastTitle = 'Error';
        this.toastType = 2;
        $('#my-toast').toast('show');
      }
    );
  }

  onPincodeSelected()
  {
    let pincodes = this.productForm.get('pincodes').value;
    if(pincodes.length > 1){
      var lastSelected = pincodes[pincodes.length -1];
      if(lastSelected == 0){
        pincodes = [0];
      }else {
        const index = pincodes.indexOf(0);
        if (index > -1) {
          pincodes.splice(index, 1);
        }
      }
      this.productForm.controls['pincodes'].setValue(pincodes);
    }
  }

  updateFixedFeeProduct(){
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.adminService.updateFixedFeeProduct(this.productForm.value)
        .subscribe(success => {
          if(success.success) {
            this.toastBody = success.error.message;
            this.toastTitle = 'Success';
            this.toastType = 1;
            $('#my-toast').toast('show');
            setTimeout(() => {
              this._router.navigate(['/admin/fixed-fee-products/list']);
            }, 500);
          } else {
            this.toastBody = success.error.message;
            this.toastTitle = 'Error';
            this.toastType = 2;
            $('#my-toast').toast('show');
          }
        }, error => {
          this.toastBody = error.message;
          this.toastTitle = 'Error';
          this.toastType = 2;
          $('#my-toast').toast('show');
        });
  }

}
