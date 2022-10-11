import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';

import { ListingService } from 'src/app/shared/services';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { UrlService } from 'src/app/shared/services/url.service';
import { Router } from '@angular/router';
import { SAND_BAG, SAND_BULK, SUPPLEMNETRY, DEFAULT_TRUCK_SIZE, DEFAULT_BAG_SIZE, DEFAULT_UNIT_TRUCK, DEFAULT_UNIT_BAG } from 'src/app/shared/constants';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-create-fixed-price-product',
  templateUrl: './create-fixed-price-product.component.html',
  styleUrls: ['./create-fixed-price-product.component.css'],
})
export class CreateFixedPriceProductComponent implements OnInit {
  @Input() isEdit: true | false | '' = '';
  @Input() productId: any;
  @Output() backToList = new EventEmitter<any>();
  
  udLoading: boolean = false;
  cityList: any = {};
  productForm: any;
  paymentTermList: any[] = [];
  deliveryTermList: any[] = [];
  gradeList: any[] = [];
  productList: any[] = [];
  productType = {
    sand_bulk: SAND_BULK,
    supllementry: SUPPLEMNETRY,
    sand_bag: SAND_BAG
  };
  defaultUnitSize = {
    truck: DEFAULT_TRUCK_SIZE,
    bag: DEFAULT_BAG_SIZE
  };

  defaultUnits = {
    truck: DEFAULT_UNIT_TRUCK,
    bag: DEFAULT_UNIT_BAG
  };

  productTypeList = [
    {
      name: 'Sand Bulk',
      value: SAND_BULK
    },
    {
      name: 'Supplementary Product',
      value: SUPPLEMNETRY
    },
    {
      name: 'Sand Bag',
      value: SAND_BAG
    }
  ];
  creditPrices: any;
  creditPriceType = [
    {
      name: 'Flat',
      value: 1
    },
    {
      name: 'Percentage',
      value: 2
    }
  ];

  productDetails: any;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private listingService: ListingService,
    private _router :Router,
    private toastService: ToastService

  ) {}

  ngOnInit(): void {

    // this.listTruckSize();

    this.listProducts();
    this.listPaymentTerms('payment');
    this.listDeliveryTerms('delivery');
    this.initForm();
    if(this.productId){
      this.getProductDetail(this.productId);
    }
  }


  // handle back to list
  back2List(refresh: boolean = false) {
    this.backToList.emit({ refresh });
  }


  initForm() {
    this.productForm = this.fb.group({
      id: [''],
      product_type: [this.productType.sand_bulk],
      product_id : ['', Validators.required],
      grade_id: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      min_order_qnty: ['1', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      incremental_order_velue: ['1', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      payment_term_id: ['', Validators.required],
      delivery_term_id: ['', Validators.required],
      source: [''],
      silt: [''],
      default_unit_size: [this.defaultUnitSize.truck],
      unit_id: [DEFAULT_UNIT_TRUCK.value],
      credit_type: [],
      credit_prices: new FormArray([
      ]),
    });
    this.creditPrices = this.productForm.get('credit_prices') as FormArray;
  }

  addCredit() {
    if(this.creditPrices && this.creditPrices.length > 0) {
      let exist = this.creditPrices.value.find((x: any) => x.payment_term_id === this.productForm.value.payment_term_id );
      if(exist)
        return this.showDanger('This term already added.');
    }
    let credit = this.fb.group({
      payment_term_id: [this.productForm.value.payment_term_id, Validators.required],
      payment_term_days: [$('#p_term_name').val(), Validators.required],
      type: [this.productForm.value.credit_type, Validators.required],
      type_name: [$('#type_name').val()],
      value: [$('#credit_value').val()],
      total_value: [$('#total_value').val()]
    });
    this.creditPrices.push(credit);
  }

  calcCreditPrice() {
    let type = this.productForm.value.credit_type;
    let val = $('#credit_value').val();
    let total_value = 0;
    if(type == 1) {
      total_value = +val + +this.productForm.value.price;
    } else {
      total_value = (+val/100) * +this.productForm.value.price + +this.productForm.value.price;
      // $('#credit_value').val((+val/100));
    }
    if(total_value)
      $('#total_value').val(total_value);
  }

  onPTermChange(e: any) {
    if(e && e.type_days)
      $('#p_term_name').val(e.type_days);
  }

  onCreditTypeChange(e: any) {
    if(e && e.value) {
      $('#type_name').val(e.value);
    }
    this.calcCreditPrice();
  }

  removeCredit(i: number) {
    // if(i != 0)
      this.creditPrices.removeAt(i);
  }


  getProductDetail(id:any){
      this.adminService.getFixedFeeProductById(id).subscribe((success:any) => {
        let product = success.result ? success.result: {};
        this.productDetails = product;
        this.listGrades(product.product_id);
        this.patchForm(product);
      },(error:any) =>{
        console.log(error);
      });
  }

  patchForm(product:any){

    this.productForm.patchValue({
      id : product.id,
      product_type : product.product.product_type,
      seller_id : product.seller_id,
      product_id : product.product_id,
      grade_id : product.grade_id,
      truck_size_id : product.truck_size_id,
      lot_size : product.lot_size,
      price : product.price,
      min_order_qnty : product.min_order_qnty,
      source : product.source,
      silt : product.silt,
      payment_term_id  : product.payment_term_id,
      delivery_term_id : product.delivery_term_id,
      incremental_order_velue : product.incremental_order_velue,
      default_unit_size : product.default_unit_size,
      unit_id : product.unit_id,
      // credit_type : product.credit_type,
      // credit_prices : product.credit_prices
    });
    if(product && product.credit_payment_term && product.credit_payment_term.length > 0) {
      product.credit_payment_term.forEach((element: any) => {
        let credit = this.fb.group({
          payment_term_id: [element.payment_term_id, Validators.required],
          payment_term_days: [element.payment_term_days, Validators.required],
          type: [element.type, Validators.required],
          type_name: [element.type === 1 ? 'Flat': 'Percentage'],
          value: [element.value],
          total_value: [element.total_value]
        });
        this.creditPrices.push(credit);
      });
    }

  }

  onProductChange(e: any) {
    if(e && e.id) {
      this.listGrades(e.id);
    }
  }
  listPaymentTerms(type: any) {
    this.listingService.getPaymentDeliveryTermDaysByType(type).subscribe(
      (success) => {
        this.paymentTermList = success.result;
        // this.addCredit();
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

  listProducts(type: any = this.productType.sand_bulk) {
    // this.udLoading = true;
    this.listingService.getAuProductListSelect('?type=' + type).subscribe(
      (success) => {
        // this.udLoading = false;
        console.log(success);
        const products = success.result;
        this.productList = products;
        console.log(this.productList);
        this.productForm.controls['default_unit_size'].setValue(type === this.productType.sand_bag ? this.defaultUnitSize.bag : this.defaultUnitSize.truck);
        this.productForm.controls['unit_id'].setValue(type === this.productType.sand_bag ? DEFAULT_UNIT_BAG.value : DEFAULT_UNIT_TRUCK.value);
      },
      (error) => {
        // this.udLoading = false;
        console.log(error);
        this.productList = [];
      }
    );
  }

  listGrades(id: any) {
    this.listingService.getProductGradeList(id).subscribe(
      (success) => {
        console.log(success);
        this.gradeList = success.result;
        this.productForm.controls['grade_id'].setValue(this.gradeList[0].id);
      },
      (error) => {
        console.log(error);
        this.gradeList = [];
      }
    );
  }

  onPublish() {
    console.log(this.productForm.value)
  }

  createFixedFeeProduct() {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.adminService.createFixedFeeProduct(this.productForm.value).subscribe(
      (success) => {
        if(success.success) {
          this.showSuccess(success.error.message);
          setTimeout(() => {
            this._router.navigate(['/admin/fixed-fee-products/list']);
          }, 500);
        } else {
          this.showDanger(success.error.message);
        }
      },
      (error) => {
        this.showDanger(error.message);
      }
    );
  }

  updateFixedFeeProduct() {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.adminService.updateFixedFeeProduct(this.productForm.value).subscribe(
      (success) => {
        if(success.success) {
          this.showSuccess(success.error.message);
          setTimeout(() => {
            // this._router.navigate(['/admin/fixed-fee-products/list']);
            this.back2List(true);
          }, 500);
        } else {
          this.showDanger(success.error.message);
        }
      },
      (error) => {
        this.showDanger(error.message);
      }
    );
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 1000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 1000 });
  }
}
