import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UrlService } from 'src/app/shared/services/url.service';
import * as moment from 'moment';
import { ToastService } from 'src/app/shared/services/toast.service';

declare let $: any;

@Component({
  selector: 'app-auction-view-edit',
  templateUrl: './auction-view-edit.component.html',
  styleUrls: ['./auction-view-edit.component.css']
})
export class AuctionViewEditComponent implements OnInit {

  @Input() selectedData: any;
  @Output() backToList = new EventEmitter<any>();

  isEdit: boolean = false;
  udLoading: boolean = false;

  auctionForm: any;

  // listing
  cityList: any = {};

  auctionDetails: any;
  gradeList: any[] = [];
  locationList: any[] = [];
  sellerPincodesList: any[] = [];
  sellerList: any[] = [];
  sellerListTemp: any[] = [];
  buyersList: any[] = [];
  paymentTermList: any[] = [];
  deliveryTermList: any[] = [];
  productList: any[] = [];
  truckSizeList: any[] = [];
  sdAmt:any='';
  security_deposit_type: any[] = [{name: 'Flat Amount', value: 'amt'},
  {name: 'Percentage', value: 'percent'}];
  selectedSeller: any;
  sellerName = new FormControl();
  selectedBuyers: any[] = [];


  autocompleteInput: any;
  isAutocompleteShown = false;
  autocompleteData: any[] = [];
  autocompleteDataTemp: any[] = [];
  currentValue: any;


  modalId = 'editAuctionConfirmation';
  modalData = {
    title: '',
    text: '',
    primaryBtnText:'',
    secondaryBtnText:''
  };
  productTax = 1;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private listingService: ListingService,
    public urlService: UrlService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getAuctionDetails();
  }

  // get auction details
  async getAuctionDetails() {
    this.udLoading = true;

    await this.adminService.getAuctionDetail(this.selectedData.id).subscribe(
      (succ) => {
        this.auctionDetails = succ.result;
        this.udLoading = false;
      },
      (fail) => {
        this.udLoading = false;
        alert(
          'Oops! An erro occured wile listing data. Please try again later.'
        );
        this.back2List(true);
      }
    );
  }

  initForm() {
    this.auctionForm = this.fb.group({
      id: [this.selectedData.id],
      location_id: [this.auctionDetails.location_id],
      seller_id: [this.auctionDetails.seller_id],
      auction_product_id: [this.auctionDetails.auction_product_id],
      grade_id: [this.auctionDetails.grade_id],
      from_datetime: [moment(this.auctionDetails.from_datetime).toDate()],
      to_datetime: [moment(this.auctionDetails.to_datetime).format('M/D/YYYY, h:mm A')],
      truck_size_id: [this.auctionDetails.truck_size_id],
      lot_size: [this.auctionDetails.lot_size, Validators.pattern("^[0-9]+(\.[0-9]{1,3})?$")],
      is_private: [this.auctionDetails.is_private],
      serviceable_pins: [this.auctionDetails.serviceable_pins],
      start_bid: [this.auctionDetails.start_bid, Validators.pattern("^[0-9]*$")],
      total_price: [this.auctionDetails.total_price, Validators.pattern("^[0-9.]*$")],
      min_limit: [this.auctionDetails.min_limit, Validators.pattern("^[0-9.]*$")],
      max_limit: [this.auctionDetails.max_limit, Validators.pattern("^[0-9.]*$")],
      payment_term_id: [this.auctionDetails.payment_term_id],
      delivery_term_id: [this.auctionDetails.delivery_term_id],
      security_deposit: [this.auctionDetails.security_deposit, Validators.pattern("^[0-9.]*$")],
      security_deposit_type: [this.auctionDetails.security_deposit_type],
      participant_ids: [[]],
      available_inventory: [''],
      total_price_with_gst: [this.auctionDetails.total_price_gst, Validators.pattern("^[0-9.]*$")],
      product_name: [this.auctionDetails.name],
      grade: [this.auctionDetails.grade],
      source_of_sand: [this.auctionDetails.source_of_sand],
      silt: [this.auctionDetails.silt],
      duration: [moment(moment(this.auctionDetails.to_datetime).format('YYYY-MM-DD HH:mm')).diff(moment(this.auctionDetails.from_datetime).format('YYYY-MM-DD HH:mm'), 'minutes')],
      hide_auction_number: [this.auctionDetails.hide_auction_number],
      quantity_variation: [this.auctionDetails.quantity_variation]
    });
    this.sellerName.setValue(this.auctionDetails.seller_name);
    if(this.auctionDetails.serviceable_pincodes) {
      const pins: any[] = [];
      this.auctionDetails.serviceable_pincodes.forEach((element: any) => {
        pins.push(element.pincode_id);
      });
      this.auctionForm.controls['serviceable_pins'].setValue(pins);
    }
    if(this.auctionDetails.is_private) {
      this.selectedBuyers = this.auctionDetails.participants;
      let ids: any[] = [];
      this.selectedBuyers.forEach(element => {
        ids.push(element.id);
      });
      this.auctionForm.controls['participant_ids'].setValue(ids);
    }
  }

  // handle back to list
  back2List(refresh: boolean = false) {
    this.backToList.emit({ refresh });
  }

  // handle edit form click
  onFillDetailsClick(e: any) {

    const currentDateTime = new Date();
    const auctionStartTime = new Date(this.auctionDetails.from_datetime);
    if(currentDateTime.getTime() < auctionStartTime.getTime()) {
      this.initEditMode();
    } else {
      this.showModel()
    }
  }

  showModel(){
    this.modalId = 'editAuctionConfirmation';
    this.modalData.text = `Auction ${this.auctionDetails.auction_number} is currently live. Are you sure you want to continue?`;
    this.modalData.title = 'Update Auction Confirmation';
    this.modalData.primaryBtnText = "YES";
    this.modalData.secondaryBtnText = "NO";
    $('#' + this.modalId).modal('show');
  }

  showExtendPopUp()
  {
    this.modalId = 'addTimeModal';
    this.modalData.text = 'Are you sure you want to extend time by 5 minutes?'
    this.modalData.title = 'Extend Time';
    $('#' + this.modalId).modal('show');
  }

  editConfirmResponse(e: any) {
    if(e){
      if(this.modalId == 'addTimeModal') {
        this.extendTime();
      } else {
        this.initEditMode();
      }
    }else{
    }
  }

  extendTime(){
    this.listingService.extendAuctionTime(this.selectedData.id).subscribe(
      (success) => {
        console.log(success);
        if(success.success) {
          this.showSuccess(success.error.message);
          this.getAuctionDetails();
        } else {
          this.showDanger(success.error.message);
        }
        $('#' + this.modalId).modal('hide');
      },
      (error) => {
        this.showDanger('Something went wrong.');
      }
    );
  }

  initEditMode() {
    this.isEdit = true;

    this.listTruckSize();
    this.listPaymentTerms('payment');
    this.listDeliveryTerms('delivery');
    this.listLocation();
    this.listUsersForAuction(2);
    this.listUsersForAuction(1);
    // this.listGrades(this.auctionDetails.auction_product_id);
    this.listSellersPincodes(this.auctionDetails.seller_id);
    this.initForm();

    $('#grade').val(this.auctionDetails.grade);
    $('#product_name').val(this.auctionDetails.name);
    // this.listProducts();
  }

  onProductChange(e: any) {
    this.productTax = e.tax;
    this.listGrades(e.id);
    this.calcPrice();
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

  setValue(val: any){
    this.autocompleteInput = val.name;
    this.isAutocompleteShown = false;
    // this.onItemSelect.emit(this.autocompleteInput);
  }

  onSellerChange(e: any) {
    // this.listSellersPincodes(e.id);
    this.auctionForm.controls['seller_id'].setValue(this.selectedSeller.id);
    this.listSellersPincodes(this.auctionForm.value.seller_id);
    this.sellerName.setValue(this.selectedSeller.name);
    this.auctionForm.controls['available_inventory'].setValue(this.selectedSeller.tonnage);
    this.auctionForm.controls['auction_product_id'].setValue(this.selectedSeller.product_id);
    this.auctionForm.controls['grade_id'].setValue(this.selectedSeller.grade_id);
    // $('#grade').val(this.selectedSeller.grade);
    // $('#product_name').val(this.selectedSeller.product_name);
    this.auctionForm.controls['grade'].setValue(this.selectedSeller.grade);
    this.auctionForm.controls['product_name'].setValue(this.selectedSeller.product_name);
    // this.listProducts();
    // this.listGrades(this.selectedSeller.product_id);
    this.calcPrice();
  }

  onSellerRadioChange(e: any) {
    this.selectedSeller = e;
  }

  filterAutocompleteForSeller(e: any) {
    const arr = this.sellerList;
    const result = arr.filter((item: any) => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
    this.sellerListTemp = result;
  }

  onAddParticipants(e: any) {
    let isExists = false;
    this.isAutocompleteShown = false;
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


  //lists for form

  listGrades(id: any) {
    this.listingService.getProductGradeList(id).subscribe(
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
          this.selectedSeller = this.sellerList.find(x => x.id === this.auctionForm.value.seller_id)
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

  // listProducts() {
  //   this.listingService.getAuProductList().subscribe(
  //     (success) => {
  //       this.productList = success.result;
  //       success.result.forEach((element: any) => {
  //         if(this.selectedSeller.product_id == element.id) {
  //           this.productTax = element.tax;
  //         }
  //       });
  //     },
  //     (error) => {
  //       this.productList = [];
  //     }
  //   );
  // }

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

  handleFormSubmit() {
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
    if(this.auctionForm.invalid) {
      this.auctionForm.markAllAsTouched();
      return;
    }

    // const fromDateTime = moment(this.auctionForm.value.from_datetime).format('YYYY-MM-DD HH:MM:SS');
    // const toDateTime = moment(this.auctionForm.value.to_datetime).format('YYYY-MM-DD HH:MM:SS');
    // this.auctionForm.controls['from_datetime'].setValue(fromDateTime);
    // this.auctionForm.controls['to_datetime'].setValue(toDateTime);

    this.adminService.updateAuction(this.auctionForm.value).subscribe(
      (success) => {
        if(success.success) {
          this.showSuccess(success.error.message);
          this.isEdit = false;
          // this.getAuctionDetails();
          this.back2List(true);
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
