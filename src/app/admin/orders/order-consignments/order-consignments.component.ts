import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ListingService } from 'src/app/shared/services';
import { F_VARIANCE, ORDER_HOLD } from 'src/app/shared/constants';
import * as moment from 'moment';
declare let $: any;
@Component({
  selector: 'app-order-consignments',
  templateUrl: './order-consignments.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./order-consignments.component.css']
})
export class OrderConsignmentsComponent implements OnInit {
  @Input() consignmentId: any;
  @Input() consignmentNo: any;
  @Input() defaultTruckBagSize: any;
  @Input() orderItems: any;
  @Input() orderStatus: any;
  @Output() backToList = new EventEmitter<any>();
  udLoading: boolean = false;
  isListLoading: boolean = false;
  truckList: any[] = [];
  truckForm: any;
  inValidTruckTonnage: boolean = false;


  consignmentDetails: any;
  creditNoteForm: any;
  reasonType: any = [
    {
      name: 'Standard',
      value: 1
    },
    {
      name: 'Other',
      value: 2
    }
  ];
  transit_pass_url: any = '';
  transistPass: boolean = false;
  other_docs_url: any = '';
  otherDocs: boolean = false;
  truckSizeList: any[] = [];
  isVarianceValid: boolean = false;
  minVar = 0;
  maxVar = 0;
  holdStatus = ORDER_HOLD;
  constructor(private _userService: UserService, private fb: FormBuilder, public urlService: UrlService, private toastService: ToastService, private listingService: ListingService) { }

  ngOnInit(): void {
    this.initForm();
    this.getTrucks();
    this.listTruckSize();
    // this.initCreditNoteForm();
  }

  listTruckSize() {
    this.listingService.getTruckSizeList().subscribe(
      (success) => {
        this.truckSizeList = success.result;
        // let counts: any[] = [];
        // this.truckSizeList.forEach(e => {
        //   counts.push(e.lot_size);
        // });
        // const goal = this.getNearestNumber(counts, this.defaultTruckBagSize);
        // const d = this.truckSizeList.find(x => x.lot_size == goal);
        // this.truckForm.controls.truck_size_id.setValue(d.id);
        // this.varianceValidation();
      },
      (error) => {
        this.truckSizeList = [];
      }
    );
  }

  initForm() {
    this.truckForm = this.fb.group({
      id: [''],
      consignment_id: [this.consignmentId],
      // tonnage: ['', [Validators.required, Validators.max(this.auctionDetails.lot_size)]],
      lr_number:[''],
      eway_number:[''],
      // transporter:[''],
      vehicle_number: ['', Validators.required],
      tonnage: ['', Validators.required],
      driver_name: ['', Validators.required],
      driver_number: ['', [Validators.required,Validators.pattern('[0-9]{10}')]],
      make: [''],
      remark: [''],
      transit_pass: ['', Validators.required],
      transit_pass_number: [''],
      other_doc: [''],
      order_item_id: ['', Validators.required],
      truck_size_id: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  onProductChange() {
    const a = this.orderItems.find((x: any) => x.order_item_id === this.truckForm.value.order_item_id);
    // this.truckForm.controls['tonnage'].setValue(a.truck_size);
    let counts: any[] = [];
    this.truckSizeList.forEach(e => {
      counts.push(e.lot_size);
    });
    this.truckForm.controls.tonnage.setValue(+a.tonnage);
    const goal = this.getNearestNumber(counts, +a.tonnage);
    const d = this.truckSizeList.find(x => x.lot_size == goal);
    this.truckForm.controls.truck_size_id.setValue(d.id);
    this.varianceValidation();
  }

  initCreditNoteForm(tId: any, type = 1) {
    this.creditNoteForm = this.fb.group({
      id: [''],
      truck_detail_id: [tId, Validators.required],
      tonnage: ['', Validators.required],
      delivery_challan: ['', Validators.required],
      remark: ['standard reason', Validators.required],
      reason_type: [1, Validators.required],
      type: [type]
    });
  }

  onCreditFormClose() {
    this.creditNoteForm.reset();
  }

  onReasonTypeChange() {
    if(this.creditNoteForm.value.reason_type == 1) {
      this.creditNoteForm.controls['remark'].setValue('standard reason');
    } else {
      this.creditNoteForm.controls['remark'].setValue('');
    }
  }

  onCreditNoteFormSubmit() {
    if(this.creditNoteForm.invalid) {
      this.creditNoteForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    for (const key in this.creditNoteForm.value) {
      fd.append(key, this.creditNoteForm.value[key])
    }

    this._userService.generateCreditNote(fd)
    .subscribe(success=>{
      if(success.success){
        this.showSuccess(success.error.message);
        $('#generateCreditNoteModal').modal('hide');
        this.getTrucks();
      }else{
        this.showDanger(success.error.message);
      }
    });

  }

  onGenerateInvoice(tId:any) {
    this._userService.generateOrderTruckInvoice({truck_detail_id: tId})
    .subscribe(success=>{
      if(success.success){
        this.showSuccess(success.error.message);
        this.getTrucks();
      }else{
        this.showDanger(success.error.message);
      }
    });
  }
  onGenerateDC(tId:any) {
    this._userService.generateOrderTruckDC({truck_detail_id: tId, type: 'dc'})
    .subscribe(success=>{
      if(success.success){
        this.showSuccess(success.error.message);
        this.getTrucks();
      }else{
        this.showDanger(success.error.message);
      }
    });
  }

  // handle back to list
  back2List(refresh: boolean = false, data: any = null) {
    this.backToList.emit({ refresh: refresh, data: data  });
  }

  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.truckForm.controls["transit_pass"].setValue(file);
  }
  fileBrowseHandler2(event:any){
    const file = event.target.files[0];
    this.truckForm.controls["other_doc"].setValue(file);
  }

  fileBrowseHandlerCreditNote(event:any){
    const file = event.target.files[0];
    this.creditNoteForm.controls["delivery_challan"].setValue(file);
  }

  calcMaxTonnage() {

  }

  getTrucks(){
    this.inValidTruckTonnage = true;
    this._userService.getTrucks(this.consignmentId)
    .subscribe(success=>{
      this.inValidTruckTonnage = false;
      if(success.success){
        this.consignmentDetails = success.result;
        this.truckList = success.result.truck_details;
        this.orderItems = success.result.consignment_products;
        console.log(this.truckList);
      } else {
        this.orderItems = [];
        this.truckList = [];
        this.consignmentDetails = null;
      }
    });
  }

  addTruckDetails(){
    if(this.truckForm.invalid || !this.isVarianceValid) {
      this.truckForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    for (const key in this.truckForm.value) {
      fd.append(key, this.truckForm.value[key])
    }
    if(this.truckForm.value.id) {
      this._userService.updateTruck(fd)
      .subscribe(success=>{
        if(success.success){
          this.showSuccess(success.error.message);
          $('#addTruckSidebar').modal('hide');
          this.getTrucks();
        }else{
          this.showDanger(success.error.message);
        }
      });
    } else {
      this._userService.addTruck(fd)
      .subscribe(success=>{
        if(success.success){
          this.showSuccess(success.error.message);
          $('#addTruckSidebar').modal('hide');
          this.getTrucks();
        }else{
          this.showDanger(success.error.message);
        }
      });
    }
  }

  onEditTruckClick(editData: any) {
      // this.listTruckSize();
      this.truckForm.controls.id.setValue(editData.truck_detail_id);
      this.truckForm.controls.consignment_id.setValue(editData.consignment_id);
      this.truckForm.controls.lr_number.setValue(editData.lr_number ? editData.lr_number: '');
      this.truckForm.controls.eway_number.setValue(editData.eway_number ? editData.eway_number : '');
      this.truckForm.controls.vehicle_number.setValue(editData.vehicle_number);
      this.truckForm.controls.tonnage.setValue(editData.tonnage);
      this.truckForm.controls.driver_name.setValue(editData.driver_name);
      this.truckForm.controls.driver_number.setValue(editData.driver_number);
      this.truckForm.controls.make.setValue(editData.make ? editData.make : '');
      this.truckForm.controls.remark.setValue(editData.remark ? editData.remark : '');
      this.truckForm.controls.order_item_id.setValue(editData.order_item_id);
      this.truckForm.controls.date.setValue(moment(editData.date).format('YYYY-MM-DD'));
      let counts: any[] = [];
      this.truckSizeList.forEach(e => {
        counts.push(e.lot_size);
      });
      const goal = this.getNearestNumber(counts, +editData.tonnage);
      const d = this.truckSizeList.find(x => x.lot_size == goal);
      this.truckForm.controls.truck_size_id.setValue(d.id);
      this.varianceValidation();

      if(editData.transit_pass) {
        this.transistPass = true;
        this.transit_pass_url = editData.transit_pass;
      } else {
        this.transistPass = false;
        this.transit_pass_url = '';
      }
      if(editData.other_docs) {
        this.otherDocs = true;
        this.other_docs_url = editData.other_docs;
      } else {
        this.otherDocs = false;
        this.other_docs_url = '';
      }
  }

  newForm(){
    this.transistPass = false;
    this.transit_pass_url = '';
    this.otherDocs = false;
    this.other_docs_url = '';
    // this.listTruckSize();
    this.initForm();
    // this.truckForm.controls.order_item_id.setValue(this.consignmentDetails.order_item_id);
  }

  getNearestNumber(counts: any, goal: number) {
    var closest = counts.reduce(function(prev: number, curr: number) {
      return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    return closest;
  }

  varianceValidation() {
    // return console.log(value);
    const value = +this.truckForm.value.tonnage;
    const truckSize = this.truckSizeList.find(x => x.id == this.truckForm.value.truck_size_id);
    const plusMinusValue = truckSize.lot_size * F_VARIANCE/100;
    this.minVar = truckSize.lot_size - plusMinusValue;
    this.maxVar = truckSize.lot_size + plusMinusValue;
    if(value <= this.maxVar && value >= this.minVar)
      this.isVarianceValid = true;
    else
      this.isVarianceValid = false;
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
