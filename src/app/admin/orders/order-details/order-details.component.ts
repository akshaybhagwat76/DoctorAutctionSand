import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { UNITS, APPROVED, NOT_APPROVED, RESCHEDULE, ORDER_HOLD, BUYER_ACCEPTED } from 'src/app/shared/constants';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { UserService } from 'src/app/shared/services/user.service';
declare let $: any;
@Component({
  selector: 'app-admin-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  isUploadPOModalOpen: boolean = false;
  isViewPdfModalOpen: boolean = false;
  isScheduleConsignmentModalOpen: boolean = false;
  isConsignmentModalOpen: boolean = false;
  selectedConsignmentId: any;
  consignmentNo: any;
  uploadPOFormData: any[] = [
    {
      fieldName: 'Purchase Order Number',
      fieldType: 'text',
      formControlName: 'oc_number'
    },
    {
      fieldName: 'Purchase Order Date',
      fieldType: 'date',
      formControlName: 'oc_date'
    },
    {
      fieldName: 'Upload Purchase Order',
      fieldType: 'file',
      formControlName: 'oc_file'
    }
  ];

  scheduleConsignmentFormData: any[] = [
    {
      fieldName: 'Select Product',
      fieldType: 'select',
      formControlName: 'order_item_id',
      value: ''
    },
    {
      fieldName: 'Date',
      fieldType: 'date',
      formControlName: 'date'
    },
    {
      fieldName: 'Tonnage',
      fieldType: 'text',
      formControlName: 'tonnage'
    }
  ];
  orData: any = {
    doc_name: 'Order Request',
    doc_id: 'order-request',
    doc_number: 'N/A',
    doc_date: '',
    doc_url: '',
  }
  ocData: any = {
    doc_name: 'Order Confirmation',
    doc_id: 'order-confirmation',
    doc_number: 'N/A',
    doc_date: '',
    doc_url: ''
  }
  poData: any = {
    doc_name: 'Purchase Order',
    doc_id: 'purchase-order',
    doc_number: 'N/A',
    doc_date: ''
  }
  paymentData: any = {
    doc_name: 'Payment',
    doc_id: 'paymet',
    order_value: 0,
    invoice_amount: 0,
    received_amount: 0,
    due_amount: 0
  }
  orderSummary: any = {
  };
  orderDetails: any;

  dcListFields: any[] = [
    {
      field: 'consignment_no',
      fieldName: 'Consignment No.'
    },
    {
      field: 'delivery_date',
      fieldName: 'Delivery Date'
    },
    {
      fieldName: 'Tonnage',
      field: 'tonnage'
    },
    {
      fieldName: 'Invoice Amount',
      field: 'invoice_amount'
    },
    {
      fieldName: 'Invoice',
      field: 'invoice_path'
    },
    {
      field: 'deiplay_status',
      fieldName: 'Status'
    }
  ];
  dcList: any[] = [
  ];
  units = UNITS;
  orderId: any;
  pdfUrl: any;
  pdfModalTitle: string = '';
  pdfModalSubTitle: string = '';
  deliveryText: any = '';
  tncText: any = '';
  paymentText: any = '';
  formOutputValue: any;
  isListLoading: boolean = false;

  dsApproved = APPROVED;
  dsNotApproved = NOT_APPROVED;
  dsReschedule = RESCHEDULE;
  adminDetails: any;

  modalId = 'confirmModal';
  modalData: any = {
    text: '',
    title: ''
  };
  defaultTruckBagSize: any;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  holdStatus = ORDER_HOLD;
  unHoldStatus = BUYER_ACCEPTED;

  constructor(private route: ActivatedRoute,
    private _userService: UserService,
    public urlService: UrlService,
    public adminService: AdminService,
    private toastService: ToastService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) { }

  ngOnInit(): void {
    this.adminDetails = localStorage.getItem('doctor-sand-user');
    this.adminDetails = JSON.parse(this.adminDetails);
    this.fromDate = this.calendar.getToday();
    // this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    this.toDate = this.fromDate;
    this.orderId = this.route.snapshot.params.order_id;
    this.getOrderDetails();
    this.getStaticContent();
  }

  confirmModalResponse(e:any)
  {
    if(e){
      this.submitApproveDeliverySchedule();
    }
  }

  openConfirmModal(date: any, cId: any)
  {
    this.selectedConsignmentId = cId;
    this.modalData = {
      title: 'Approve Delivery Schedule',
      text: 'Are you sure you want to approve delivery schedule on ' + date + ' ?'
    };
    $('#' + this.modalId).modal('show');
  }

  submitApproveDeliverySchedule() {
    this._userService.approveConsignmnet({consignment_id: this.selectedConsignmentId})
      .subscribe(success=>{
        if(success.success) {
          this.showSuccess(success.error.message);
          this.getOrderDetails();
        } else {
          this.showDanger(success.error.message);
        }
      }, error => {
        console.log(error);
          this.showDanger('Something went wrong.');
      });
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

  getOrderDetails(){
    this.isListLoading = true;
    this._userService.getUserOrderDetails(this.orderId)
      .subscribe((success:any) => {
        this.isListLoading = false;
        this.orderDetails = success.result;
        console.log(this.orderDetails);
        if(success.success) {
          this.defaultTruckBagSize = this.orderDetails.truck_size;
          this.setPdfData(this.orderDetails);
          this.setOrderSummary(this.orderDetails);
          this.parseDcList(this.orderDetails.cosignmnet);
          this.scheduleConsignmentFormData = [
            {
              fieldName: 'Select Product',
              fieldType: 'select',
              formControlName: 'order_item_id',
              value: this.orderSummary?.product_details,
              buyer_id: this.orderDetails.user_id,
              seller_id: this.orderDetails.seller_id,
            },
            {
              fieldName: 'Date',
              fieldType: 'date',
              formControlName: 'date',
            }
            // {
            //   fieldName: 'Tonnage',
            //   fieldType: 'text',
            //   formControlName: 'tonnage',
            //   value: this.orderDetails.total_tonnage
            // }
          ];
        }
      },(error:any) => {
        this.isListLoading = false;
        console.log(error);
    });
  }

  setPdfData(data: any) {
    if(data && data.attachment_o_r) {
      this.orData = {
        doc_name: data.attachment_o_r.name,
        doc_id: 'order-request',
        doc_number: data.attachment_o_r.number,
        doc_date: data.attachment_o_r.date,
        doc_url: data.attachment_o_r.path,
      }
    }
    if(data && data.attachment_o_c) {
      this.ocData = {
        doc_name: data.attachment_o_c.name,
        doc_id: 'order-confirmation',
        doc_number: data.attachment_o_c.number,
        doc_date: data.attachment_o_c.date,
        doc_url: data.attachment_o_c.path,
      }
    }
    this.poData = {
      doc_name: 'Purchase Order',
      doc_id: 'purchase-order',
      doc_number: (data.attachment_buyer_o_c && data.attachment_buyer_o_c.number) ? data.attachment_buyer_o_c.number : 'N/A',
      doc_date: (data.attachment_buyer_o_c && data.attachment_buyer_o_c.date) ? data.attachment_buyer_o_c.date : '',
      doc_url: (data.attachment_buyer_o_c && data.attachment_buyer_o_c.path) ? data.attachment_buyer_o_c.path : '',
    }

    this.paymentData = {
      doc_name: 'Payment',
      doc_id: 'paymet',
      order_value: data.grandtotal_amount,
      invoice_amount: data.grandtotal_amount,
      received_amount: data.payment_option == 2 ? '0' : data.grandtotal_amount,
      due_amount: data.payment_option == 2 ? data.grandtotal_amount : '0'
    }
  }

  parseDcList(data: any) {
    this.dcList = [];
    if(data && data.length > 0) {
      data.forEach((e: any, i: any) => {
        let a = {
          id: e.id,
          consignment_no: i + 1,
          delivery_date: e.delivery_date,
          tonnage: e.tonnage,
          invoice_amount: e.amount,
          // invoice_path: e.invoice_path,
          invoice_path: e.invoice_path ? `<a href="${this.urlService.orderConsignmentInvoiceUrl(e.invoice_path, this.orderDetails?.order_number, '')}"
                          target="_blank">
                          ${e.invoice_path} <img src="assets/img/icon_view.svg" alt="file" />
                        </a>` : 'N/A',
          status: e.status,
          deiplay_status: e.status == this.dsNotApproved ? 'Schedule' : (e.status == this.dsApproved ? 'Approved' :'Reshcedule'),
          is_created_by_me: e.created_by == this.adminDetails.user_id ? true : false
        }
        this.dcList.push(a);
      });
    }
    console.log(this.dcList);
  }

  setOrderSummary(data: any) {
    this.orderSummary = {
      oc_date: data.attachment_o_c.date,
      payment_option: data.payment_option == 1 ? 'Cash' : 'Credit',
      lot_size: data.total_tonnage,
      // price_per_ton: data.buyer_order_items.sale_products.price,
      price_per_ton: data.price,
      net_amount: data.subtotal_amount,
      gst_amount: data.tax_amount,
      gross_amount: data.grandtotal_amount,
      pickup_details: {
        name: data.seller_details.name,
        line_1: data.seller_details.line_1,
        line_2: data.seller_details.line_2,
        landmark: data.seller_details.landmark,
        city_name: data.seller_details.city_name,
        state_name: data.seller_details.state_name,
        country_name: 'IN',
        pincode: data.seller_details.pincode,
        poc: data.seller_details.name,
        email: data.seller_details.email,
        phone: data.seller_details.mobile
      },
      product_details: []
    };

    data.buyer_order_items.forEach((e: any) => {
      let a = {
        order_item_id: e.id,
        name: e.sale_products.product.name,
        grade: e.sale_products.grade.grade,
        fm: e.sale_products.grade.fineness_modulus,
        silt: e.sale_products.silt,
        source: e.sale_products.source,
        report_1: '',
        report_2: '',
        truck_size: e.truck_size,
        qty: e.qty
      }
      this.orderSummary.product_details.push(a);
    });
  }

  handleModalClose(e: any) {
    // if (e && e.refresh) {
    //   this.listComponent.fetchListItems();
    // }
    this.isUploadPOModalOpen = false;
  }

  onUploadPo(e: any) {
    this.isUploadPOModalOpen = e;
  }

  onModelFooterClose(e: any) {
    // this.isUploadPOModalOpen = false;
    // console.log(e);
    if(e && e.action && e.action == 'ok') {
      console.log(this.formOutputValue);
      this.uploadBuyerOc(this.formOutputValue);
    } else {
      // this.formOutputValue = null;
      this.isUploadPOModalOpen = false;
    }
  }

  uploadBuyerOc(data: any){
    if(data && data.oc_file && data.oc_number !== '' && data.oc_date !== ''){
      let fd: any = new FormData();
      fd.append('order_id', this.orderId);
      fd.append('oc_file', data.oc_file);
      fd.append('oc_number', data.oc_number);
      fd.append('oc_date', data.oc_date);
      this._userService.uploadBuyerOrderOC(fd)
      .subscribe(success=>{
        if(success.success){
          this.showSuccess(success.error.message);
          this.formOutputValue = null;
          this.isUploadPOModalOpen = false;
          this.getOrderDetails();
        }else{
          this.showDanger(success.error.message);
        }
      });
    } else {
      this.showDanger('All feilds required.');
    }
  }

  getFormOutput(e: any) {
    // console.log(e);
    this.formOutputValue = e;
  }

  onAddConsignmnet() {
    this.isScheduleConsignmentModalOpen = true;
  }

  handleScheduleConsignmentModalClose(e: any) {
    // if (e && e.refresh) {
    //   this.listComponent.fetchListItems();
    // }
    this.isScheduleConsignmentModalOpen = false;
  }

  getScheduleFormOutput(e: any) {
    // console.log(e);
    this.formOutputValue = e;
  }

  onScheduleConsignmentsModelFooterClose(e: any) {
    // this.isUploadPOModalOpen = false;
    // console.log(e);
    if(e && e.action && e.action == 'ok') {
      console.log(this.formOutputValue);
      this.submitScheduleConsignment();
    } else {
      // this.formOutputValue = null;
      this.isScheduleConsignmentModalOpen = false;
    }
  }

  handleViewPDFModalClose(e: any) {
    // if (e && e.refresh) {
    //   this.listComponent.fetchListItems();
    // }
    this.isViewPdfModalOpen = false;
  }

  onViewPDF(e: any, type: any) {
    this.pdfModalSubTitle = 'Order ID : ' + this.orderDetails.order_number;
    if(type) {
      if(type == 'or') {
        this.pdfUrl = this.urlService.orderOROCUrl(this.orderDetails?.attachment_o_r?.path, this.orderDetails?.order_number);
        this.pdfModalTitle = 'Order Request';
      } else if(type == 'oc') {
        this.pdfUrl = this.urlService.orderOROCUrl(this.orderDetails?.attachment_o_c?.path, this.orderDetails?.order_number);
        this.pdfModalTitle = 'Order Confirmation';
      } else if(type == 'buyer_oc') {
        this.pdfUrl = this.urlService.orderbuyerOCUrl(this.orderDetails?.attachment_buyer_o_c?.path, this.orderDetails?.order_number);
        this.pdfModalTitle = 'Buyer Order Confirmation';
      }
      this.isViewPdfModalOpen = e;
    }
  }

  submitScheduleConsignment() {
    if(!this.formOutputValue || !this.formOutputValue.tonnage || !this.formOutputValue.date || !this.formOutputValue.order_item_id
      || !this.formOutputValue.pickup_address_id || !this.formOutputValue.delivery_address_id ) {

      this.showDanger('All feilds required.');
      return;
    }
    this.formOutputValue.order_id = this.orderId;
    this._userService.scheduleConsignmnet(this.formOutputValue)
      .subscribe(success=>{
        if(success.success){
          this.showSuccess(success.error.message);
          this.isScheduleConsignmentModalOpen = false;
          this.getOrderDetails();
        }else{
          this.showDanger(success.error.message);
        }
      });
  }

  handleDispatchClick(e: any = null, i: number) {
    this.selectedConsignmentId = e;
    this.consignmentNo = i;
    this.isConsignmentModalOpen = true;
  }

  handleConsignmnetModalClose(e: any) {
    this.isConsignmentModalOpen = false;
  }

  getConsignmentList(){
    this.isListLoading = true;
    this.dcList = [];
    let queryParams = `?order_id=${this.orderId}`;
    if(this.fromDate && this.fromDate.day) {
      queryParams += `&from_date=${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`;
    }
    if(this.toDate && this.toDate.day) {
      queryParams += `&to_date=${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`;
    }
    this._userService.getConsignmentList(queryParams)
      .subscribe((success:any) => {
        this.isListLoading = false;

        if(success.success) {
          this.orderDetails.consignment = success.result;
          this.parseDcList(success.result);
        }
      },(error:any) => {
        this.isListLoading = false;
        console.log(error);
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  onDateSelectionClose() {
    this.getConsignmentList();
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  holdUnholdOrder(status: any) {
    this.adminService.holdOrder({order_id: this.orderId, status: status}).subscribe(
      (response: any) => {
        if(response.success) {
          this.showSuccess(response.error.message);
          this.getOrderDetails();
        } else {
          this.showDanger(response.error.message);
        }
      }, (error: any) => {
        this.showDanger(error.error.message);
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
