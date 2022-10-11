import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NEW, PAY_COMPLETED } from 'src/app/shared/constants';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-consignment-invoice',
  templateUrl: './consignment-invoice.component.html',
  styleUrls: ['./consignment-invoice.component.css']
})
export class ConsignmentInvoiceComponent implements OnInit {

  @Input() consignmentId: any;
  @Input() consignmentNo: any;
  @Output() backToList = new EventEmitter<any>();

  udLoading: boolean = false;
  isListLoading: boolean = false;
  isListLoading2: boolean = false;
  truckList: any[] = [];
  invoiceList: any[] = [];
  consignmentDetails: any;
  auctionDetails: any;
  consignmentForm: any;
  invoiceForm: any;
  inValidAcceptedTonnage: boolean = false;
  invoices: any;
  inValidTotalInvoiceAmount: boolean = false;
  paid:any = PAY_COMPLETED;
  payment_pending:any = NEW;

  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              public urlService: UrlService,
              private _userService:UserService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.getConsignmentDetails();
    this.getInvoices();
  }

  initForm() {
    this.consignmentForm = this.fb.group({
      consignment_id: [this.consignmentDetails.id, Validators.required],
      accepted_tonnage: [{value: this.consignmentDetails.accepted_tonnage ? this.consignmentDetails.accepted_tonnage : '', disabled: true}],
      accepted_dc_path: [{value: this.consignmentDetails.accepted_dc_path ? this.consignmentDetails.accepted_dc_path : '', disabled: true}],
      // accepted_dc_date: ['', Validators.required],
      amount: [{value: this.consignmentDetails.amount ? this.consignmentDetails.amount : '', disabled: true}],
      remark: [this.consignmentDetails.remark ? this.consignmentDetails.remark : ''],
      tonnage: [{value: this.consignmentDetails.tonnage, disabled: true}],
      auction_number: [{value: this.auctionDetails.auction_number, disabled: true}],
      oc_number: [{value: this.auctionDetails.oc_number, disabled: true}],
    });
  }

  initInvoiceForm() {
    this.invoiceForm = this.fb.group({
      id: [''],
      consignment_id: [this.consignmentDetails.id],
      total_amount: [this.consignmentDetails.amount],
      no_of_invoice: [1, Validators.required],
      tonnage: ['', Validators.required],
      invoices: new FormArray([this.fb.group({
        amount: [this.consignmentDetails.amount, Validators.required],
      })]),
    });

    this.invoices = this.invoiceForm.get('invoices') as FormArray;
  }

  onNumberOfInvoiceInput() {
    let no_of_invoice = +this.invoiceForm.value.no_of_invoice;
    this.invoices.clear();
    for(let i = 0; i < no_of_invoice; i++) {
      let invoice = this.fb.group({
        amount: ['', Validators.required],
      });
      this.invoices.push(invoice);
    }
  }

  removeInvoice(i: number) {
    this.invoices.removeAt(i);
  }

  calcMaxAmount() {
    let tAmount = 0;
    this.invoices.controls.forEach((e: any) => {
      tAmount += +e.value.amount;
    });
    if(tAmount == this.consignmentDetails.amount) {
      this.inValidTotalInvoiceAmount = false;
    } else {
      this.inValidTotalInvoiceAmount = true;
    }
  }

  // handle back to list
  back2List(refresh: boolean = false, data: any = null) {
    this.backToList.emit({ refresh: refresh, data: data  });
  }

  getConsignmentDetails() {
    this.isListLoading = true;
    this.adminService.getConsignmentDetails(this.consignmentId).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.consignmentDetails = success.result.consignment_detail;
        this.auctionDetails = success.result.auction_details;
        this.truckList = success.result.consignment_trucks;
        this.initForm();
        this.initInvoiceForm();
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.consignmentDetails = null;
        this.truckList = [];
      }
    );
  }

  getInvoices()
  {
    this.isListLoading2 = true;
    this._userService.getInvoices(this.consignmentId).subscribe(success=>{
      this.isListLoading2 = false;
      if(success.success)
      {
        this.invoiceList = success.result;
      }else{
        this.invoiceList = [];
      }
      console.log(this.invoiceList);
    },
    error=>{
      console.log(error);
    })
  }

  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.consignmentForm.controls['accepted_dc_path'].setValue(file);
  }

  onAcceptedTonnageInput() {
    if(+this.consignmentForm.value.accepted_tonnage > this.consignmentDetails.tonnage) {
      this.inValidAcceptedTonnage = true;
    } else {
      this.inValidAcceptedTonnage = false;
      if(this.consignmentForm.controls['accepted_tonnage'].valid) {
        let amount = +this.auctionDetails.bid * +this.consignmentForm.value.accepted_tonnage;
        let gst = amount * (+this.auctionDetails.product_tax/100);
        this.consignmentForm.controls['amount'].setValue(amount + gst);
      }
    }
  }

  // submitAcceptedConsignment() {
  //   if(this.consignmentForm.invalid) {
  //     this.consignmentForm.markAllAsTouched();
  //     return;
  //   } else if(this.inValidAcceptedTonnage) {
  //     this.consignmentForm.markAllAsTouched();
  //     return;
  //   }
  //   let fd = new FormData();
  //   fd.append('consignment_id', this.consignmentForm.value.consignment_id);
  //   fd.append('accepted_tonnage', this.consignmentForm.value.accepted_tonnage);
  //   fd.append('accepted_dc_path', this.consignmentForm.value.accepted_dc_path);
  //   fd.append('remark', this.consignmentForm.value.remark);
  //   fd.append('amount', this.consignmentForm.value.amount);

  //   this.adminService.updateAcceptedConsignment(fd).subscribe(
  //     (success) => {
  //       console.log(success);
  //       this.toastBody = success.error.message;
  //       if(success.success){
  //         this.toastTitle = 'success';
  //         this.toastType = 1;
  //         this.back2List(true);
  //       }else{
  //         this.toastTitle = 'error';
  //         this.toastType = 2;
  //       }
  //       $('#my-toast').toast('show');
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  generateInvoices() {
    // let fd = new FormData();
    // fd.append('consignment_id', this.invoiceForm.value.consignment_id);
    // fd.append('invoices', JSON.stringify(this.invoiceForm.value.invoices));
    this._userService.generateInvoicesForConsifnment(this.invoiceForm.value).subscribe(
      (success) => {
          console.log(success);
          if(success.success){
            this.showSuccess(success.error.message);
            $('#invoiceModal').modal('hide');
            this.back2List(true);
            // this.getInvoices();
          }else{
            this.showDanger(success.error.message);
          }
        },
      (error) => {
          console.log(error);
          this.showDanger(error.message);
      })
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
