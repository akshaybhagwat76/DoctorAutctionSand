import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'
import { UserService } from 'src/app/shared/services/user.service';
import { WindowRefService } from '../../shared/services/window-ref.service';
import {
  CREDIT_ACCOUNT,
  CURRENT_ACCOUNT,NODAL_ACCOUNT
} from 'src/app/shared/constants';
declare let $: any;
@Component({
  selector: 'app-epassbook',
  templateUrl: './epassbook.component.html',
  styleUrls: ['./epassbook.component.css']
})
export class EpassbookComponent implements OnInit {
  transactionList:any = [];
  passbookDetails:any;
  currentAccount:any;
  nodalAccount:any;
  creditAccount: any;
  amtError:any = '';
  user: any;
  isBuyer: boolean = false;
  constructor(private winRef: WindowRefService,
    private _router: Router,
    private route: ActivatedRoute,
    private _userService: UserService) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('doctor-sand-user');
    this.user = JSON.parse(this.user);
    if(this.user.role_id === 1)
      this.isBuyer = true;
    this.getPassbookBalance();
    this.getSDTransactions();
  }

  goToTransaction(trans_id: any){
    console.log(" trans Id=> ",trans_id);
    this._router.navigateByUrl('/user/epassbook/transaction/'+trans_id);
  }

  getSDTransactions()
  {
    this._userService.getTransactions()
      .subscribe(success =>{
        // console.log(success)
        if(success.success){
          this.transactionList = success.result;
          console.log(this.transactionList);
        }
      }, error => {
        console.log(error);
      });
  }

  getPassbookBalance()
  {
    this._userService.getPassbookBalance()
      .subscribe(success =>{
        // console.log(success)
        if(success.success){
          const passbookDetails = success.result;
          console.log(passbookDetails);
          if(passbookDetails && passbookDetails.length>0){
            passbookDetails.forEach((element:any) => {
              if(element.account_type == NODAL_ACCOUNT){
                this.nodalAccount = element;
              }
              if(element.account_type == CURRENT_ACCOUNT){
                this.currentAccount = element;
              }
              if(element.account_type == CREDIT_ACCOUNT) {
                this.creditAccount = element;
              }
            });
          }
        }
      }, error => {
        console.log(error);
      });
  }

  addAmount(){
    $("#confirmModel").modal('show');
  }
  Pay(){
    this.amtError = '';
    const amt = $('#inputAmt').val();
    if(amt && amt > 0){
      console.log(amt);
      this._userService.createRPOrder({amount:amt})
        .subscribe(success=>{
          console.log(success.result);
          if(success.success){
            $("#confirmModel").modal('hide');
            this.payWithRazor(success.result)
          }
        }, error => {
        console.log(error);
      });
    }else{
      this.amtError = 'Please enter valid amount';
    }
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
      this._userService.verifyPaymentSignatureSD({ response,base_amount : val.base_amount }).subscribe(
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
}
