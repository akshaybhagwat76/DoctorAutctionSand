import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import * as moment from 'moment';
import { ToastService } from 'src/app/shared/services/toast.service';

declare let $: any;
@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.css']
})
export class CreateAuctionComponent implements OnInit {

  gradeList: any[] = [];
  productList: any[] = [];
  truckSizeList: any[] = [];
  sellerList: any[] = [];
  sellerListTemp: any[] = [];
  paymentTermList: any[] = [];
  deliveryTermList: any[] = [];
  locationList: any[] = [];
  sellerPincodesList: any[] = [];
  auctionForm: any;
  autocompleteInput: any;
  isAutocompleteShown = false;
  autocompleteData: any[] = [];
  autocompleteDataTemp: any[] = [];
  currentValue: any;
  selectedBuyers: any[] = [];
  buyersList: any[] = [];

  selectedSeller: any;
  sellerName = new FormControl();

  sdAmt:any='';
  security_deposit_type: any[] = [{name: 'Flat Amount', value: 'amt'},
  {name: 'Percentage', value: 'percent'}];

  productTax = 1;
  currentDate = new Date();

  constructor(private listingService: ListingService,
              private adminService: AdminService,
              private fb: FormBuilder,
              private el: ElementRef,
              private _router :Router,
              private toastService: ToastService) { }

  ngOnInit(): void {
    // this.listProducts();
    this.listTruckSize();
    // this.listGrades(1);
    // this.listSellers();
    this.listPaymentTerms('payment');
    this.listDeliveryTerms('delivery');
    this.listLocation();
    this.initForm();
    // this.listBuyers();
    this.listUsersForAuction(2);
    this.listUsersForAuction(1);
  }

  initForm() {
    this.auctionForm = this.fb.group({
      location_id: ['', Validators.required],
      seller_id: ['', Validators.required],
      auction_product_id: ['', Validators.required],
      grade_id: ['', Validators.required],
      from_datetime: ['', Validators.required],
      to_datetime: ['', Validators.required],
      truck_size_id: ['', Validators.required],
      lot_size: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,3})?$")]],
      is_private: [false, Validators.required],
      serviceable_pins: ['', Validators.required],
      start_bid: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      confirm_start_bid: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      total_price: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      min_limit: ['1', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      max_limit: ['10', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      payment_term_id: ['', Validators.required],
      delivery_term_id: ['', Validators.required],
      security_deposit: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      security_deposit_type: ['amt', Validators.required],
      participant_ids: [[]],
      available_inventory: [''],
      total_price_with_gst: ['', Validators.pattern("^[0-9.]*$")],
      source_of_sand: [''],
      silt: [''],
      duration: [''],
      hide_auction_number: [false],
      quantity_variation: [10]
    });


  }

  onProductChange(e: any) {
    this.productTax = e.tax;
    this.listGrades(e.id);
    console.log(this.productTax);
    this.calcPrice();
  }

  onSellerChange(e: any) {
    // this.listSellersPincodes(e.id);
    this.auctionForm.controls['seller_id'].setValue(this.selectedSeller.id);
    this.listSellersPincodes(this.auctionForm.value.seller_id);
    this.sellerName.setValue(this.selectedSeller.name);
    this.auctionForm.controls['available_inventory'].setValue(this.selectedSeller.total);
    this.auctionForm.controls['auction_product_id'].setValue(this.selectedSeller.product_id);
    this.auctionForm.controls['grade_id'].setValue(this.selectedSeller.grade_id);
    $('#grade').val(this.selectedSeller.grade);
    $('#product_name').val(this.selectedSeller.product_name);
    // this.listProducts();
    // this.listGrades(this.selectedSeller.product_id);
    this.productTax = this.selectedSeller.tax;
    this.calcPrice();
  }

  onSellerRadioChange(e: any) {
    this.selectedSeller = e;
  }

  listGrades(id: any) {
    // this.listingService.getProductGradeList(id).subscribe(
    //   (success) => {
    //     this.gradeList = success.result;
    //   },
    //   (error) => {
    //     this.gradeList = [];
    //   }
    // );

    let date = this.auctionForm.get('from_datetime').value;
    let seller_id = this.auctionForm.get('seller_id').value;
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
    let date = this.auctionForm.get('from_datetime').value;
    let seller_id = this.auctionForm.get('seller_id').value;
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

  listBuyers() {
    this.adminService
      .usersList({
        type: 'BUYERS'
      })
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.buyersList = res.result;
          } else {
            this.buyersList = [];
          }
        },
        (err) => {
          this.buyersList = [];
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

  onAddParticipants(e: any) {
    this.isAutocompleteShown = false;
    let isExists = false;
    this.selectedBuyers.forEach(element=>{
      if(element.id == e.id){
        isExists = true;
      }
    })
    if(!isExists){
      this.selectedBuyers.push({
        id: e.id,
        name: e.name
      });
    }

    let ids: any[] = [];
    this.selectedBuyers.forEach(element => {
      if(ids.indexOf(element.id) == -1){
        ids.push(element.id);
      }
    });
    this.auctionForm.controls['participant_ids'].setValue(ids);
  }

  onRemoveParticipant(i: any) {
    this.selectedBuyers.splice(i, 1);
    let ids: any[] = [];
    this.selectedBuyers.forEach(element => {
      ids.push(element.id);
    });
    this.auctionForm.controls['participant_ids'].setValue(ids);
  }

  createAuction() {
    let start_bid = this.auctionForm.get('start_bid').value;
    let confirm_start_bid = this.auctionForm.get('confirm_start_bid').value;
    let pincodes = this.auctionForm.get('serviceable_pins').value;
    if(pincodes.includes(0)){
      var pincodeArray:any = [];
      this.sellerPincodesList.forEach((e:any)=>{
        if(e.id != 0){
          pincodeArray.push(e.id);
        }
      })
      this.auctionForm.controls['serviceable_pins'].setValue(pincodeArray);
    }
    let invalidControl;
    if (start_bid != confirm_start_bid) {
      invalidControl = this.el.nativeElement.querySelector('[formcontrolname="confirm_start_bid"]');
      invalidControl.focus();
      return
    }
    if(this.auctionForm.invalid) {
      this.auctionForm.markAllAsTouched();
      return;
    }
    // const fromDateTime = moment(this.auctionForm.value.from_datetime).format('YYYY-MM-DD HH:MM:SS');
    // const toDateTime = moment(this.auctionForm.value.to_datetime).format('YYYY-MM-DD HH:MM:SS');
    // this.auctionForm.controls['from_datetime'].setValue(fromDateTime);
    // this.auctionForm.controls['to_datetime'].setValue(toDateTime);
    this.adminService.createAuction(this.auctionForm.value).subscribe(
      (success) => {
        if(success.success) {
          this.showSuccess(success.error.message);
          setTimeout(() => {
            this._router.navigate(['/admin/auctions/list']);
          }, 500);
        } else {
          this.showDanger(success.error.message);
        }
        // this.initForm();
        // this.listProducts();
      },
      (error) => {
        this.showDanger(error.message);
      }
    );
  }

  calcPrice() {
    let lotSize = +this.auctionForm.value.lot_size;
    let startBid = +this.auctionForm.value.start_bid;
    if(lotSize > 0 && startBid > 0){
      let totalPrice = lotSize * startBid;
      this.auctionForm.controls['total_price'].setValue(totalPrice.toFixed(2));
      this.auctionForm.controls['total_price_with_gst'].setValue(((totalPrice * (this.productTax/100)) + totalPrice).toFixed(2));
    }
    if(lotSize && lotSize > 0) {
      if(lotSize > 500) {
        this.auctionForm.controls['security_deposit'].setValue('100000');
      } else {
        this.auctionForm.controls['security_deposit'].setValue('50000');
      }
    }
  }

  calcSecurityDeposite()
  {
    let totalPrice = +this.auctionForm.value.total_price;
    let sdType = this.auctionForm.value.security_deposit_type;
    let sdPercent = +this.auctionForm.value.security_deposit;
    if(totalPrice > 0 && sdType == 'percent' && sdPercent > 0){
      this.sdAmt = totalPrice * (sdPercent/100);
      this.sdAmt = 'Amount will be ₹ ' + this.sdAmt;
    }else{
      this.sdAmt = '';
    }
  }

  onPincodeSelected()
  {
    let pincodes = this.auctionForm.get('serviceable_pins').value;
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
      this.auctionForm.controls['serviceable_pins'].setValue(pincodes);
    }
  }

  onTotimeChange() {
    // let toTime: any = this.adminService.addMinutes(new Date(this.auctionForm.value.from_datetime), this.auctionForm.value.duration);
    // console.log(toTime);
    // this.auctionForm.controls['to_datetime'].setValue(this.adminService.formatDateTime(toTime));
    const toDateTime = moment(this.auctionForm.value.from_datetime).add(this.auctionForm.value.duration, 'minutes');
    this.auctionForm.controls['to_datetime'].setValue(toDateTime.format('M/D/YYYY, h:mm A'));
  }

  onFromtimeChange() {
    this.auctionForm.controls['duration'].setValue(60);
    this.onTotimeChange();
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
