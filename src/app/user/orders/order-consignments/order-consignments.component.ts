import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { WindowRefService } from 'src/app/shared/services/window-ref.service';
import { CHEQUE, RTGS } from 'src/app/shared/constants';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-user-order-consignments',
  templateUrl: './order-consignments.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./order-consignments.component.css']
})
export class OrderConsignmentsComponent implements OnInit {
  @Input() consignmentId: any;
  @Input() consignmentNo: any;
  @Output() backToList = new EventEmitter<any>();
  @Input() orderItems: any;
  @Input() orderDetails: any;
  udLoading: boolean = false;
  isListLoading: boolean = false;
  truckList: any[] = [];
  inValidTruckTonnage: boolean = false;
  toastBody: any;
  toastTitle: any;
  toastType: any;
  consignmentDetails: any;
  selectedTruckIds: any[] = [];
  selectedType: string = '';
  offlinePayForm:any;
  offlineFormError:any;
  paymentMode = [
    {
      value: CHEQUE, name: 'Cheque'
    },
    {
      value: RTGS, name: 'RTGS'
    }
  ];
  cheque = CHEQUE;
  rtgs = RTGS;
  dueAmount: number = 0;
  constructor(private _userService: UserService, private fb: FormBuilder, public urlService: UrlService, private winRef: WindowRefService,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.getTrucks();
  }

  // handle back to list
  back2List(refresh: boolean = false, data: any = null) {
    this.backToList.emit({ refresh: refresh, data: data  });
  }

  getTrucks(){
    this.inValidTruckTonnage = true;
    this.isListLoading = true;
    this._userService.getTrucks(this.consignmentId)
    .subscribe(success=>{
      this.isListLoading = false;
      this.inValidTruckTonnage = false;
      if(success.success){
        this.consignmentDetails = success.result;
        this.truckList = success.result.truck_details;
        // console.log(this.truckList);
        this.dueAmount = 0;
        this.truckList.forEach(element => {
          this.dueAmount += element.is_paid ? 0 : +element.amount;
        });
      } else {
        this.truckList = [];
        this.consignmentDetails = null;
      }
    }, error => {
      this.isListLoading = false;
      this.truckList = [];
      this.consignmentDetails = null;
    });
  }

  onTruckSelect(e: any, tId: any) {
    this.selectedType = tId;
    if(tId && tId === 'all') {
      this.selectedTruckIds = [];
      if(e && e.target && e.target.checked) {
        this.truckList.forEach(element => {
          if(!element.is_paid)
            this.selectedTruckIds.push(element.truck_detail_id);
        });
      }
    } else {
      if(e && e.target && e.target.checked) {
        console.log(e);
        let exist = this.selectedTruckIds.includes(tId);
        if(!exist) {
          this.selectedTruckIds.push(tId);
        }
      } else {
        let exist = this.selectedTruckIds.includes(tId);
        if(exist) {
          let i = this.selectedTruckIds.indexOf(tId);
          this.selectedTruckIds.splice(i, 1);
        }
      }
    }
    console.log(this.selectedTruckIds);
  }

  makePayment(){
    this._userService.makeBuyerOrderPayment({truck_detail_id: this.selectedTruckIds})
    .subscribe(success=>{
      this.inValidTruckTonnage = false;
      if(success.success){
        this.payWithRazor(success.result);
      }
    }, error => {
      console.log(error);
    });
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
      this._userService.verifyPaymentSignatureBuyerOrderConsignmentLevel({ response, base_amount : val.amount, order_id: val.order_id, consignment_id: this.consignmentId, trcuk_detail_id: this.selectedTruckIds,
        buyer_order_id: this.consignmentDetails.order_id }).subscribe(
        (success) => {
          if(success.success) {
            // this.getTrucks();
            this.showSuccess(success.error.message);
            this.getTrucks();
            this.selectedTruckIds = [];
            this.selectedType = '';
          } else {
            console.log(success);
            this.showDanger(success.error.message);
          }
        },
        (fail) => {
          this.showDanger(fail);
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

  offlineDialog()
  {
    this.initForm();
    this.offlinePayForm.controls['transaction_id'].setValue('credit_' + Math.random().toString(36).substring(2));
    this.offlinePayForm.controls['truck_detail_id'].setValue(JSON.stringify(this.selectedTruckIds));
    this.offlinePayForm.controls['net_amount'].setValue(this.dueAmount);
    $("#offlineDocumentModal").modal('show');
  }

  OfflinePayment(){
    if(this.offlinePayForm.invalid)
    {
      this.offlinePayForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    fd.append('truck_detail_id', this.offlinePayForm.value.truck_detail_id);
    // fd.append('truck_detail_id', JSON.stringify(this.selectedTruckIds));
    fd.append('transaction_id', this.offlinePayForm.value.transaction_id);
    fd.append('cheque_no', this.offlinePayForm.value.cheque_no);
    fd.append('file', this.offlinePayForm.value.file);
    fd.append('net_amount', this.offlinePayForm.value.net_amount);
    fd.append('payment_mode', this.offlinePayForm.value.payment_mode);
    fd.append('bank_name', this.offlinePayForm.value.bank_name);

    this._userService.offlinePaymentBuyerOrder(fd).subscribe(
      (success) => {
        console.log(success);
        if(success.success) {
          $("#offlineDocumentModal").modal('hide');
          this.showSuccess(success.error.message);
          this.getTrucks();
          this.selectedTruckIds = [];
          this.selectedType = '';
        } else {
          this.showDanger(success.error.message);
        }
        // this.getInvoices();
      },
      (error) => {
        this.showDanger(error.message);
      }
    );
  }

  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.offlinePayForm.controls['file'].setValue(file);
  }

  initForm(isnew:any = true) {
    this.offlineFormError = "";
    this.offlinePayForm = this.fb.group({
      truck_detail_id:['',Validators.required],
      transaction_id: ['', Validators.required],
      cheque_no: ['', Validators.required],
      file: [''],
      net_amount: ['', Validators.required],
      payment_mode: [CHEQUE, Validators.required],
      bank_name: ['', Validators.required]
    });
  }

  togglePopup(e: any) {
    // $('#' + e).toggleClass('show');
    $('#' + e).modal('toggle');
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 1000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 1000 });
  }

}
