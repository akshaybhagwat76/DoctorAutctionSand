import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { CHEQUE, NEW, PAY_COMPLETED, RTGS } from 'src/app/shared/constants';
import { ActivatedRoute,Router } from '@angular/router';
import { WindowRefService } from '../../../shared/services/window-ref.service';
import { FormBuilder, Validators } from '@angular/forms';
declare let $: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  consignmentId:any;
  invoiceList:any;
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
  constructor(private route: ActivatedRoute,
    private _userService:UserService,
    public urlService: UrlService,
    private _router :Router,
    private winRef: WindowRefService,
    private fb: FormBuilder) {
      this.consignmentId = this.route.snapshot.params.consignmentId;
     }

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices()
  {
    this._userService.getInvoices(this.consignmentId).subscribe(success=>{
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

  payRazor(id:any)
  {
    this._userService.createRPOrderInvoice({id:id})
    .subscribe(success=>{
      console.log(success.result);
      if(success.success){
        this.payWithRazor(success.result)
      }
    }, error => {
    console.log(error);
  });
  }


  payWithRazor(val: any) {
    const options: any = {
      key: val.razorpayKey,
      amount: val.amount, // amount should be in paise format to display Rs 1255 without decimal point
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
      this._userService.verifyPaymentSignatureInvoice({ response,id : val.id }).subscribe(
        (success) => {
          if(success.success) {
            // this.ngOnInit();
            window.location.reload();
          } else {
            console.log(success);
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

  offlineDialog(invoiceData:any)
  {
    this.initForm();
    this.offlinePayForm.controls['transaction_id'].setValue(Math.floor((Math.random() * 1000000) + 1));
    this.offlinePayForm.controls['id'].setValue(invoiceData.id);
    this.offlinePayForm.controls['net_amount'].setValue(invoiceData.total_amount);
    $("#confirmModel").modal('show');
  }

  OfflinePayment(){
    if(this.offlinePayForm.invalid)
    {
      this.offlineFormError = "All (*) fields are required";
      return;
    }
    let fd = new FormData();
    fd.append('id', this.offlinePayForm.value.id);
    fd.append('transaction_id', this.offlinePayForm.value.transaction_id);
    fd.append('cheque_no', this.offlinePayForm.value.cheque_no);
    fd.append('file', this.offlinePayForm.value.file);
    fd.append('net_amount', this.offlinePayForm.value.net_amount);
    fd.append('payment_mode', this.offlinePayForm.value.payment_mode);
    fd.append('bank_name', this.offlinePayForm.value.bank_name);

    this._userService.offlinePayment(fd).subscribe(
      (success) => {
        console.log(success);
        $("#confirmModel").modal('hide');
        this.getInvoices();
      },
      (error) => {
        console.log(error);
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
      id:['',Validators.required],
      transaction_id: ['', Validators.required],
      cheque_no: ['', Validators.required],
      file: [''],
      net_amount: ['', Validators.required],
      payment_mode: [CHEQUE, Validators.required],
      bank_name: ['', Validators.required]
    });
  }
}
