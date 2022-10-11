import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UrlService } from 'src/app/shared/services/url.service';

declare let $: any;
@Component({
  selector: 'app-accepted-dc',
  templateUrl: './accepted-dc.component.html',
  styleUrls: ['./accepted-dc.component.css']
})
export class AcceptedDcComponent implements OnInit {
  
  @Input() consignmentId: any;
  @Output() backToList = new EventEmitter<any>();

  udLoading: boolean = false;
  isListLoading: boolean = false;
  truckList: any[] = [];
  consignmentDetails: any;
  auctionDetails: any;
  consignmentForm: any;
  inValidAcceptedTonnage: boolean = false;
  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              public urlService: UrlService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.getConsignmentDetails();
  }

  initForm() {
    console.log(this.consignmentDetails.amount);
    this.consignmentForm = this.fb.group({
      consignment_id: [this.consignmentDetails.id, Validators.required],
      accepted_tonnage: [this.consignmentDetails.accepted_tonnage ? this.consignmentDetails.accepted_tonnage : '', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      accepted_dc_path: [this.consignmentDetails.accepted_dc_path ? this.consignmentDetails.accepted_dc_path : '', Validators.required],
      // accepted_dc_date: ['', Validators.required],
      amount: [this.consignmentDetails.amount ? this.consignmentDetails.amount : '', Validators.required],
      remark: [this.consignmentDetails.remark ? this.consignmentDetails.remark : ''],
      tonnage: [{value: this.consignmentDetails.tonnage, disabled: true}],
      auction_number: [{value: this.auctionDetails.auction_number, disabled: true}],
      oc_number: [{value: this.auctionDetails.oc_number, disabled: true}],
    });
  }

  // handle back to list
  back2List(refresh: boolean = false) {
    this.backToList.emit({ refresh });
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
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.consignmentDetails = null;
        this.truckList = [];
      }
    );
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
        let amount = (+this.auctionDetails.bid * +this.consignmentForm.value.accepted_tonnage).toFixed(2);
        let gst = +amount * (+this.auctionDetails.product_tax/100);
        this.consignmentForm.controls['amount'].setValue((+amount + +gst).toFixed(2));
      }
    }
  }

  submitAcceptedConsignment() {
    if(this.consignmentForm.invalid) {
      this.consignmentForm.markAllAsTouched();
      return;
    } else if(this.inValidAcceptedTonnage) {
      this.consignmentForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    fd.append('consignment_id', this.consignmentForm.value.consignment_id);
    fd.append('accepted_tonnage', this.consignmentForm.value.accepted_tonnage);
    fd.append('accepted_dc_path', this.consignmentForm.value.accepted_dc_path);
    fd.append('remark', this.consignmentForm.value.remark);
    fd.append('amount', this.consignmentForm.value.amount);

    this.adminService.updateAcceptedConsignment(fd).subscribe(
      (success) => {
        console.log(success);
        if(success.success){
          this.showSuccess(success.error.message);
          this.back2List(true);
        }else{
          this.showDanger(success.error.message);
        }
      },
      (error) => {
        console.log(error);
        this.showDanger(error.message);
      }
    );
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
