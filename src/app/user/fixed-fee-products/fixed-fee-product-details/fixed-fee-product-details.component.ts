import { CurrencyPipe, formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService, ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WindowRefService } from 'src/app/shared/services/window-ref.service';
declare let $: any;

@Component({
  selector: 'app-fixed-fee-product-details',
  templateUrl: './fixed-fee-product-details.component.html',
  styleUrls: ['./fixed-fee-product-details.component.css']
})
export class FixedFeeProductDetailsComponent implements OnInit {

  productId:number = 0;
  addressForm: any;
  stateList: any[] = [];
  cityList: any[] = [];
  addressList: any[] = [];
  selectedAddress: any;
  isDeliverable: any;
  dial_code = [
    { code: '91', name: '+91' }
  ];
  pricePerTon: any = 1000;
  IsExWorks: boolean = false;
  logisticPrice: any = 2000;
  totalForTon: any = 3000;
  totalNetForAmount: any = 4000;
  gstAmount: any = 1000;
  grossAmount: any = 5000;
  pincodeModalId = 'pincodeModal';
  pincodeModalData ={
    title: 'Servicable Pincodes',
    text: '',
    showCancel: false
  };
  confirmOrderModalId = 'confirmOrderModal';
  confirmOrderModalData:any ={
    title: '<span class="text-primary">Order Summary</span>',
    text: ''
  };
  buyOrderModalId = 'buyOrderModal';
  buyOrderModalData ={
    title: 'Order Summary',
    text: ''
  };
  deliveryText: any = '';
  tncText: any = '';
  paymentText: any = '';
  analysisReport: any;
  concertReport: any;
  productDetails: any = {
    image: '',
    name: '',
    description: '',
    grade: '',
    silt: '',
    source_of_sand: '',
    fineness_modulus: ''
  };

  quantityList:any[] =  [
    // { id :1, name : '1'},  { id :2, name : '2'},
    // { id :3, name : '3'},  { id :4, name : '4'},
    // { id :5, name : '5'},  { id :6, name : '6'},
    // { id :7, name : '7'},  { id :8, name : '8'},
    // { id :9, name : '9'},  { id :10, name : '10'},
  ];
  isTermChecked: any;
  selectedPaymentOption: any = '1';
  selectedDeliveryOption: any = '1';
  productNotFound : any = false;
  deliveryDetailsForm: any;
  isCreditExceed: boolean = false;
  isCreditEnabled: boolean = false;
  user: any;
  constructor(
    private _userService: UserService,
    public urlService: UrlService,
    private _router: Router,
    private _activatedRoute : ActivatedRoute,
    private fb: FormBuilder,
    private _adminService : AdminService,
    public _registerService: RegisterService,
    private _listingService: ListingService,
    private winRef: WindowRefService,
    private currencyPipe : CurrencyPipe,
    public toastService: ToastService) { }

  ngOnInit(): void {

    this.user = localStorage.getItem('doctor-sand-user');
    if(this.user) {
      this.user = JSON.parse(this.user);
    }
    let paramId = this._router.url.split('/')[5];
    if(paramId){
      this.productId = +paramId;

      this.initForm();
      this.initDeliveryForm();
      this.getProductData(paramId);
      this.addressForm.controls['user_id'].setValue(this.user.user_id);
    }else{
      this.productNotFound = true;
    }
  }

  getProductData(id: any){
    this._adminService.getFixedFeeProductById(id)
        .subscribe(success => {
          if(success.success){
            let product = success.result;
            product.logistic_price = 0;
            this.productDetails = {
              ...product,
              product_number: product.product_number,
              truck_size: product.default_unit_size,
              // qty: product.
              source_of_sand : product.source,
              name : product.product.name || '',
              description: product.product.description,
              gradedetails : product.grade,
              grade: product.grade ? product.grade.grade : '',
              silt: product.silt,
              fineness_modulus: product.grade ? product.grade.fineness_modulus : '',
              image: product.product.image
            }
            console.log(this.productDetails);
            if(product.delivery_term)
              this.deliveryText = 'Days : ' + product.delivery_term.type_days;
            if(product.payment_term)
              this.paymentText = 'Days : ' + product.payment_term.type_days;

            // let quantity = this.quantityList.find(x => x.id == product.min_order_qnty);
            // console.log(quantity);
            // for(let i = 1; i < 100; i++) {
            //   let a = { id :i * product.incremental_order_velue, name : i * product.incremental_order_velue};
            //   this.quantityList.push(a);
            // }
            // this.quantityList = this.quantityList.filter(q => q.id >= product.min_order_qnty);
            let subtotal = Math.round((+product.price + +product.logistic_price) * (product.min_order_qnty));
            let grand_total = Math.round(subtotal + (subtotal * product.product.tax/100));
            let gst_applied = Math.round(subtotal * product.product.tax/100);
            this.deliveryDetailsForm.patchValue({
              quantity : product.min_order_qnty,
              // payment_term_days : product.payment_term ? product.payment_term.type_days : '',
              // payment_term_id : product.payment_term ? product.payment_term.id : '',
              price_per_ton : product.price,
              net_for_price : subtotal, //temporary
              truck_size: Math.round(product.default_unit_size),
              total_tonnage: +product.default_unit_size * product.min_order_qnty,
              grand_total: grand_total,
              gst_applied: gst_applied,
              logistics_price: product.logistic_price,
              for_price_per_ton: +product.price + +product.logistic_price
            })
          }else{
            this.productNotFound = true;
          }

        }, error => {
          this.productNotFound = true;
        });
  }

  onTonnageChange() {
    this.deliveryDetailsForm.controls.quantity.setValue(this.deliveryDetailsForm.value.total_tonnage);
    this.calcAmounts();
  }

  initDeliveryForm(){
    this.deliveryDetailsForm = this.fb.group({
      quantity : ['', Validators.required],
      payment_option : ['1',Validators.required],
      delivery_option : ['1', Validators.required],
      payment_term_id : [''],
      payment_term_days : [''],
      price_per_ton : [0, Validators.required],
      logistics_price :[0],
      for_price_per_ton : [0],
      net_for_price : [0],
      gst_applied : [0, Validators.required],
      address_id : [''],
      isTermChecked: [false],
      truck_size : [''],
      grand_total : [''],
      total_tonnage: ['', Validators.required],
      credit_charge: [0],
      credit_total: [0]
    });
  }

  setDeliveryOption(option:string){
    this.deliveryDetailsForm.controls['delivery_option'].setValue(option);
    this.selectedDeliveryOption = option;
    if(option == '1') {
      this.IsExWorks = false;
    } else {
      this.IsExWorks = true;
      // this.isDeliverable = 'true';
    }
    this.calcAmounts();
  }
  setPaymentOption(option:string){
    // console.log(option);
    this.deliveryDetailsForm.controls['payment_option'].setValue(option);
    this.selectedPaymentOption = option;
    this.calcAmounts();
  }
  // Go2Tab
  goToTab(id:any){
    if(id){
      document.getElementById(id)?.click();
    }
  }

  getStaticContent()
  {
    this._userService.getStaticText()
      .subscribe(success=>{
        console.log(success);
        const staticObj = success.result;
        if(staticObj && staticObj.length > 0)
        staticObj.forEach((element:any) => {
          if(element.type == "delivery"){
            this.deliveryText = element.content;
          }
          if(element.type == "general"){
            this.tncText = element.content;
          }
          if(element.type == "payment"){
            this.paymentText = element.content;
          }
        });
      })
  }

  getServicePincodes()
  {
    const pincodes = this.productDetails.pincodes;
    if(pincodes && pincodes.length > 0){
      this.pincodeModalData.text = '';

      pincodes.forEach((e: any) => {
        this.pincodeModalData.text += e.pincode + '</br>';
      });
    }else{
      this.pincodeModalData.text = 'No serviceable pincodes';
    }
    $('#' + this.pincodeModalId).modal('show');
  }

  initForm() {
    this.addressForm = this.fb.group({
      user_id: ['', Validators.required],
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      city_id: ['', Validators.required],
      state_id: ['', Validators.required],
      pincode: ['', Validators.required],
      poc_profile: [''],
      poc_name: ['', Validators.required],
      poc_email: ['', Validators.required],
      poc_mobile: ['', [Validators.required,Validators.pattern('[0-9]{10}')]],
      dial_code: new FormControl({value: '91', disabled: true}, Validators.required)
    });
  }

  submitAddressForm() {

    if(this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    let formData = new FormData();
    formData.append('user_id',this.addressForm.controls['user_id'].value);
    formData.append('address[]',this.addressForm.controls['address'].value);
    formData.append('landmark[]',this.addressForm.controls['landmark'].value);
    formData.append('city_id[]',this.addressForm.controls['city_id'].value);
    formData.append('state_id[]',this.addressForm.controls['state_id'].value);
    formData.append('pincode[]',this.addressForm.controls['pincode'].value);
    formData.append('poc_profile[]',this.addressForm.controls['poc_profile'].value);
    formData.append('poc_name[]',this.addressForm.controls['poc_name'].value);
    formData.append('poc_email[]',this.addressForm.controls['poc_email'].value);
    formData.append('poc_mobile[]',this.addressForm.controls['poc_mobile'].value);
    formData.append('for_bid','1');
    this._registerService.update_poc_details(formData).subscribe(
      (success) => {
        console.log(success);
        if(success.success) {
          this.initForm();
          $('#OCFormModal').modal("toggle");
          this.getAddressList();
          setTimeout(() => {
            $('#OCModal').modal("toggle");
          }, 1000);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getStateList(){
    this._listingService.getStateList("1")
        .subscribe(success=>{
          this.stateList = success.result;
        },error =>{
          this.stateList = [];
        });
  }

  getCityList(){
    this._listingService.getCityListing(this.addressForm.value.state_id)
        .subscribe(success=>{
          this.cityList = success.result;
        },  error=>{
          this.cityList = [];
        })
  }

  getAddressList(){
    this._userService.getUserAddressList()
        .subscribe(success=>{
          this.addressList = success.result;
          this.selectedAddress = this.addressList.find(x => x.id == 1);
        },  error=>{
          this.addressList = [];
    });
  }

  onAddressChange(e: any) {
    this.selectedAddress = e;
  }

  onConfirmServiceAddress() {
    this._userService.checkFixedFeeServiceLocation({product_id: this.productDetails.id, address_id: this.selectedAddress.id}).subscribe(
      (success) => {
        console.log(success);
        // document.getElementById('modal-close-btn')?.click();
        // if(success.success) {
          this.initForm();
          // $('#OCFormModal').modal("toggle");
          // this.getAddressList();
          if(success.result.isServicable) {
            this.isDeliverable = 'true';
            this.showSuccess(success.error.message)
            this.deliveryDetailsForm.controls['logistics_price'].setValue(success.result.logisticPrice);
            this.productDetails.logistic_price = success.result.logisticPrice;
            this.calcAmounts();
          } else {
            // alert('This service is not available to this address.')
            this.isDeliverable = 'false';
            this.showDanger(success.error.message)
          }
          $('#OCModal').modal("toggle");
        // }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.addressForm.controls['poc_profile'].setValue(file);
  }

  onConfirmOrderConfirmation(e: any) {
    if(this.isDeliverable == 'false' || !this.isDeliverable) {
      this.showDanger('Please select valid address');
      return;
    } else if(!this.deliveryDetailsForm.controls['isTermChecked'].value) {
      this.showDanger('Please accept terms and condition');
      return;
    } else if(this.deliveryDetailsForm.value.payment_option === '2' && !this.deliveryDetailsForm.controls['payment_term_id'].value) {
      this.showDanger('Please select payment term days');
      return;
    }
    if(this.deliveryDetailsForm.invalid) {
      this.deliveryDetailsForm.markAllAsTouched();
      return;
    }
    if(e) {
      let postData = {
        fixed_product_id: this.productDetails.id,
        qty: this.deliveryDetailsForm.value.quantity,
        truck_size: this.deliveryDetailsForm.value.truck_size,
        total_tonnage: this.deliveryDetailsForm.value.total_tonnage,
        payment_option: this.deliveryDetailsForm.value.payment_option,
        delivery_option: this.deliveryDetailsForm.value.delivery_option,
        shipping_address_id: this.selectedAddress.id,
        payment_term_id: this.deliveryDetailsForm.value.payment_term_id,
      };
      this._userService.addToCart(postData)
        .subscribe(success=>{
          if(success.success) {
            console.log(postData.payment_option);
            // if(postData.payment_option == '2') {
            //   this.showSuccess(success.error.message + ' Order ID: ' + success.result);
            //   this._router.navigateByUrl('/user/orders');
            // } else {
            //   this.payWithRazor(success.result);
            // }
            this.showSuccess(success.error.message);
            this._router.navigateByUrl('/user/cart');
          } else {
            this.showDanger(success.error.message);
          }
        }, error=>{
          this.showDanger(error.message);
    });
    }
  }

  onPlaceOrder() {
    console.log(this.selectedAddress);
    if(this.isDeliverable == 'false' || !this.isDeliverable) {
      this.showDanger('Please select valid address');
      return;
    } else if(!this.deliveryDetailsForm.controls['isTermChecked'].value) {
      this.showDanger('Please accept terms and condition');
      return;
    }
    if(this.deliveryDetailsForm.controls['payment_option'].value == '1')
      this.confirmOrderModalData.primaryBtnText = 'PAY NOW';
    else
      this.confirmOrderModalData.primaryBtnText = 'CONFIRM ORDER';
      this.confirmOrderModalData.text =
    `
      <div class="text-muted font-small">
        <div class="row py-1">
        <div class="col-md-6">
          Total Tonnage :
        </div>
        <div class="col-md-6 text-right">
        ${this.deliveryDetailsForm.controls['total_tonnage'].value} tons
        </div>
        </div>

        <div class="row py-1">
        <div class="col-md-6">
          Payment Option :
        </div>
        <div class="col-md-6 text-right">
        ${this.deliveryDetailsForm.controls['payment_option'].value == '1' ? 'cash' : 'credit'}
        </div>
        </div>

        <div class="row py-1">
        <div class="col-md-6">
          Payment Terms :
        </div>
        <div class="col-md-6 text-right">
          ${this.deliveryDetailsForm.controls['payment_term_days'].value} days
        </div>
        </div>

        <div class="row py-1">
        <div class="col-md-6">
          Delivery Option :
        </div>
        <div class="col-md-6 text-right">
        ${this.deliveryDetailsForm.controls['delivery_option'].value == '1' ? 'for' : 'ex-work'}
        </div>
        </div>

        <div class="row py-1">
        <div class="col-md-12">
          Delivery location :
        </div>
        <div class="col-md-12 text-dark font-smaller">
          <b>${this.selectedAddress ? (this.selectedAddress?.landmark ? this.selectedAddress?.landmark + ', ' : '' ) + (this.selectedAddress?.line_1 ? this.selectedAddress?.line_1 + ', ' : '' ) + (this.selectedAddress?.line_2 ? this.selectedAddress?.line_2 + ', ' : '' ) + this.selectedAddress?.city_name + ', - ' + this.selectedAddress?.pincode + ', ' + this.selectedAddress.state_name : ''}</b>
        </div>
        <div class="col-md-12 text-right">
          <a  data-toggle="modal" data-target="#OCModal">change</a>
        </div>
        </div>

        <div class="row py-1">
        <div class="col-md-6">
          Price/${this.deliveryDetailsForm.value.truck_size} ton :
        </div>
        <div class="col-md-6 text-right">
          ${this.formatMoney(this.deliveryDetailsForm.controls['price_per_ton'].value)}
        </div>
        </div>`;
        if(this.deliveryDetailsForm.value.payment_option == 2) {
          this.confirmOrderModalData.text += `
          <div class="row py-1">
          <div class="col-md-6">
            Credit Charge :
          </div>
          <div class="col-md-6 text-right">
            ${this.formatMoney(this.deliveryDetailsForm.controls['credit_charge'].value)}
          </div>
          </div>

          <div class="row py-1 pt-2 pb-3 border-top-dashed">
          <div class="col-md-6">
            Price with credit/${this.deliveryDetailsForm.value.truck_size} Ton :
          </div>
          <div class="col-md-6 text-right">
            ${this.formatMoney(this.deliveryDetailsForm.controls['credit_total'].value)}
          </div>
          </div>`;
        }
        if(!this.IsExWorks) {
          this.confirmOrderModalData.text += `
          <div class="row py-1">
          <div class="col-md-6">
            Logistic/${this.deliveryDetailsForm.value.truck_size} ton :
          </div>
          <div class="col-md-6 text-right">
            ${this.formatMoney(this.deliveryDetailsForm.controls['logistics_price'].value)}
          </div>
          </div>

          <div class="row py-1 pt-2 pb-3 border-top-dashed">
          <div class="col-md-6">
            For price/${this.deliveryDetailsForm.value.truck_size} ton :
          </div>
          <div class="col-md-6 text-right">
            ${this.formatMoney(this.deliveryDetailsForm.controls['for_price_per_ton'].value)}
          </div>
          </div>
          `;
        }
        this.confirmOrderModalData.text += `
        <div class="row py-1">
        <div class="col-md-6">
          Net For Amount :
        </div>
        <div class="col-md-6 text-right">
          ${this.formatMoney(this.deliveryDetailsForm.controls['net_for_price'].value)}
        </div>
        </div>

        <div class="row py-1">
        <div class="col-md-6">
          GST :
        </div>
        <div class="col-md-6 text-right">
          ${this.formatMoney(this.deliveryDetailsForm.controls['gst_applied'].value)}
        </div>
        </div>

        <div class="row py-1 pt-2 border-top-dashed text-dark font-weight-bold">
        <div class="col-md-6">
          Order Value :
        </div>
        <div class="col-md-6 text-right">
          ${this.formatMoney(this.deliveryDetailsForm.controls['grand_total'].value)}
        </div>
        </div>

      </div>
    `;
    $('#' + this.confirmOrderModalId).modal('show');
  }

  formatMoney(value: any) {
    const temp = `${value}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp, 'INR');
  }

  calcAmounts() {
    let subtotal: any;
    let grand_total: any;
    let gst_applied: any;
    if(this.deliveryDetailsForm.value.payment_option == '2') {
      if(this.productDetails.credit_payment_term && this.productDetails.credit_payment_term.length > 0) {
        let a = this.productDetails.credit_payment_term.find((x: any) => x.payment_term_id === this.deliveryDetailsForm.value.payment_term_id );
        if(a) {
          this.deliveryDetailsForm.controls['payment_term_days'].setValue(a.payment_term_days);
          this.deliveryDetailsForm.controls['credit_charge'].setValue(a.value);
          if(a.type == 2)
            this.deliveryDetailsForm.controls['credit_charge'].setValue(a.value/100);
          this.deliveryDetailsForm.controls['credit_total'].setValue(a.total_value);
          if(this.IsExWorks) {
            // subtotal = Math.round((this.productDetails.price) * (this.deliveryDetailsForm.value.total_tonnage));
            subtotal = Math.round((this.productDetails.price + this.deliveryDetailsForm.value.credit_charge) * (this.deliveryDetailsForm.value.quantity));
            grand_total = Math.round(subtotal + (subtotal * this.productDetails.product.tax/100));
            gst_applied = Math.round(subtotal * this.productDetails.product.tax/100);
          } else {
            // subtotal = Math.round((+this.productDetails.price + +this.productDetails.logistic_price) * (this.deliveryDetailsForm.value.total_tonnage));
            subtotal = Math.round((+this.productDetails.price + this.deliveryDetailsForm.value.credit_charge + +this.productDetails.logistic_price) * (this.deliveryDetailsForm.value.quantity));
            grand_total = Math.round(subtotal + (subtotal * this.productDetails.product.tax/100));
            gst_applied = Math.round(subtotal * this.productDetails.product.tax/100);
          }
        } else {
          if(this.IsExWorks) {
            // subtotal = Math.round((this.productDetails.price) * (this.deliveryDetailsForm.value.total_tonnage));
            subtotal = Math.round((this.productDetails.price) * (this.deliveryDetailsForm.value.quantity));
            grand_total = Math.round(subtotal + (subtotal * this.productDetails.product.tax/100));
            gst_applied = Math.round(subtotal * this.productDetails.product.tax/100);
          } else {
            // subtotal = Math.round((+this.productDetails.price + +this.productDetails.logistic_price) * (this.deliveryDetailsForm.value.total_tonnage));
            subtotal = Math.round((+this.productDetails.price + +this.productDetails.logistic_price) * (this.deliveryDetailsForm.value.quantity));
            grand_total = Math.round(subtotal + (subtotal * this.productDetails.product.tax/100));
            gst_applied = Math.round(subtotal * this.productDetails.product.tax/100);
          }
        }
      }
      if(this.user.credit_limit < grand_total) {
        this.setPaymentOption('1');
        $('#creditExceedModal').modal('show');
      }
    } else {
      if(this.IsExWorks) {
        // subtotal = Math.round((this.productDetails.price) * (this.deliveryDetailsForm.value.total_tonnage));
        subtotal = Math.round((this.productDetails.price) * (this.deliveryDetailsForm.value.quantity));
        grand_total = Math.round(subtotal + (subtotal * this.productDetails.product.tax/100));
        gst_applied = Math.round(subtotal * this.productDetails.product.tax/100);
      } else {
        // subtotal = Math.round((+this.productDetails.price + +this.productDetails.logistic_price) * (this.deliveryDetailsForm.value.total_tonnage));
        subtotal = Math.round((+this.productDetails.price + +this.productDetails.logistic_price) * (this.deliveryDetailsForm.value.quantity));
        grand_total = Math.round(subtotal + (subtotal * this.productDetails.product.tax/100));
        gst_applied = Math.round(subtotal * this.productDetails.product.tax/100);
      }
    }

    this.deliveryDetailsForm.controls['net_for_price'].setValue(subtotal);
    this.deliveryDetailsForm.controls['grand_total'].setValue(grand_total);
    this.deliveryDetailsForm.controls['gst_applied'].setValue(gst_applied);

    this.deliveryDetailsForm.controls['for_price_per_ton'].setValue(Math.round((+this.productDetails.price + +this.productDetails.logistic_price)));
  }

  onQtyChange() {
    this.deliveryDetailsForm.controls['total_tonnage'].setValue(this.deliveryDetailsForm.value.quantity * this.deliveryDetailsForm.value.truck_size)
    console.log(this.deliveryDetailsForm.value);
    this.calcAmounts();
  }

  payWithRazor(val: any) {
    console.log(val.payable_amount);
    const options: any = {
      key: val.razorpayKey,
      amount: val.payable_amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'DOCTOR SAND', // company name or product name
      description: '',  // product description
      image: '../assets/img/drsandlogo.png', // company logo or product image
      order_id: val.rpOrderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      prefill: {
        name: val.name,
        email: val.email,
        contact: val.contactNumber
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0988CE'
      }
    };
    options.handler = ((response: any, error: any) => {
      options.response = response;
      response.order_id = val.order_id;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
      this._userService.verifyPaymentSignatureBuyerOrder({ response, base_amount : val.grand_total, order_id: val.order_id }).subscribe(
        (success) => {
          if(success.success) {
            window.location.href = 'user/orders';
          } else {
            console.log(success);
            this.showDanger('Something went wrong.');
          }
        },
        (fail) => {
          console.log(fail);
        }
      );
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
    console.log("start msg");
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 1000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 5000 });
  }

}
