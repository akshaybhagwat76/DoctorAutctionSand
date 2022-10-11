import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AWAITING_RESULT, OC_CONFIRMED_SELLER, OC_GENERATED, OC_SENT, OR_CONFIRMED_BUYER,
  OR_CONFIRMED_SELLER, OR_GENERATED, OR_SENT, REGISTERD_BID, INVOICE_GENERATED, OC_REJECTED_SELLER, LOST } from 'src/app/shared/constants';
import { UserService } from 'src/app/shared/services/user.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { ToastService } from 'src/app/shared/services/toast.service';

declare let $: any;
@Component({
  selector: 'app-won-details',
  templateUrl: './won-details.component.html',
  styleUrls: ['./won-details.component.css']
})
export class WonDetailsComponent implements OnInit {
  auctionId: any = '';
  bidDetails: any;
  bidAmount : any = 0;
  logisticAmout: number = 0;
  forAmount:any = 0;
  netAmount:any = 0;
  gstAmount:any = 0;
  grossAmount:any = 0;
  isExWorks:boolean = false;
  auctionData:any;
  show_await:boolean = false;
  show_confirm_or:boolean = false;
  show_await_oc:boolean = false;
  show_generate_oc:boolean = false;
  show_upload_oc:boolean = false;
  show_send_oc:boolean = false;
  isORComplete: boolean = false;
  isOCComplete: boolean = false;
  auctionDetails: any;
  analysisReport:any;
  concertReport:any;
  bidList:any;
  modalPRData = {title: "Purchase Request Confirmation",
                text: "You are confirming Purchase request"};

   modalPRejectData = {title: "Rejecting Purchase Request",
                        text: "Your 30% security deposit will be forfeit."};
  modalConfirmOCgenerate = {title: "Generate OC",
  text: "Are you sure you want to generate OC?"};

  deliveryText: any = '';
  tncText: any = '';
  paymentText: any = '';
  ORUrl: any;
  OCUrl: any;
  buyerOCUrl: any;
  buyerOCApproved: any = 0;
  OCFile: any;
  consignmentList: any[] = [];

  invoiceGenerated = INVOICE_GENERATED;

  constructor(private route: ActivatedRoute,private _userService: UserService,
    public urlService: UrlService,
    private toastService: ToastService) {
    this.auctionId = this.route.snapshot.params.auctionId;
   }

  ngOnInit(): void {
    this.getResult();
    this.getAuctionDetail();
    this.getStaticContent();
    this.getLatestBids(this.auctionId);
  }

  onConfirmPO(val: any){
    console.log('Confirm Perchase order=> ',val);
  }

  onRejectPO(val: any){
    console.log('Reject Perchase order=> ',val);
  }

  onModalPRejectData(val: any){
    console.log('Confirm Perchase order=> ',val);
  }

  getResult()
  {
    this._userService.getResult(this.auctionId)
      .subscribe(success=>{
        if(success.success){
          console.log(success.result);
          this.bidDetails = success.result;
          this.ORUrl = this.bidDetails.or_url;
          this.OCUrl = this.bidDetails.oc_url;
          this.buyerOCUrl = this.bidDetails.buyer_oc_url;
          this.buyerOCApproved = this.bidDetails.buyer_oc_approved;

          this.auctionData = this.bidDetails.auction_data;
          this.AmtCalculation();
          if(this.bidDetails.status == REGISTERD_BID || this.bidDetails.status == AWAITING_RESULT) {

              this.show_await = true;
              this.show_confirm_or = false;
              this.show_await_oc = false;
              this.show_generate_oc = false;
              this.show_upload_oc = false;
              this.show_send_oc = false;
              this.isORComplete = false;
              this.isOCComplete = false;
              this.bidDetails.state_name = 'AWAITING RESULT';

            } else if(this.bidDetails.status == OR_GENERATED || this.bidDetails.status == OR_CONFIRMED_SELLER) {

                this.show_await = true;
                this.show_confirm_or = false;
                this.show_await_oc = false;
                this.show_generate_oc = false;
                this.show_upload_oc = false;
                this.show_send_oc = false;
                this.isORComplete = true;
                this.isOCComplete = false;
                this.bidDetails.state_name = 'OR GENERATED';
                if(this.bidDetails.status == OR_CONFIRMED_SELLER)
                  this.bidDetails.state_name = 'OR CONFIRMED BY SELLER';

              } else if(this.bidDetails.status == OR_SENT) {

              this.show_await = false;
              this.show_confirm_or = true;
              this.show_await_oc = false;
              this.show_generate_oc = false;
              this.show_upload_oc = false;
              this.show_send_oc = false;
              this.isORComplete = true;
              this.isOCComplete = false;
              this.bidDetails.state_name = 'OR REQUESTED';

            } else if(this.bidDetails.status == OR_CONFIRMED_BUYER) {

              this.show_await = false;
              this.show_confirm_or = false;
              this.show_await_oc = false;
              this.show_generate_oc = false;
              this.show_upload_oc = true;
              this.show_send_oc = false;
              this.isORComplete = true;
              this.isOCComplete = false;
              this.bidDetails.state_name = 'OR CONFIRMED BY YOU';

            } else if(this.bidDetails.status == OC_GENERATED) {

              this.show_await = false;
              this.show_confirm_or = false;
              this.show_await_oc = false;
              this.show_generate_oc = false;
              this.show_upload_oc = true;
              if(this.buyerOCUrl) {
                this.show_upload_oc = false;
              }
              this.show_send_oc = true;
              this.isORComplete = true;
              this.isOCComplete = false;
              this.bidDetails.state_name = 'OC GENERATED';

            } else if(this.bidDetails.status == OC_SENT) {

              this.show_await = false;
              this.show_confirm_or = false;
              this.show_await_oc = true;
              this.show_generate_oc = false;
              this.show_upload_oc = true;
              if(this.buyerOCUrl) {
                this.show_upload_oc = false;
              }
              this.show_send_oc = false;
              this.isORComplete = true;
              this.isOCComplete = false;
              this.bidDetails.state_name = 'OC SENT';

            } else if(this.bidDetails.status == OC_CONFIRMED_SELLER) {

              this.show_await = false;
              this.show_confirm_or = false;
              this.show_await_oc = false;
              this.show_generate_oc = false;
              this.show_upload_oc = true;
              if(this.buyerOCUrl) {
                this.show_upload_oc = false;
              }
              this.show_send_oc = false;
              this.isORComplete = true;
              this.isOCComplete = true;
              this.bidDetails.state_name = 'WON';
              this.listConsignments();
            } else if(this.bidDetails.status == OC_REJECTED_SELLER) {

              this.show_await = false;
              this.show_confirm_or = false;
              this.show_await_oc = false;
              this.show_generate_oc = false;
              this.show_upload_oc = false;

              this.show_send_oc = false;
              this.isORComplete = false;
              this.isOCComplete = false;
              this.bidDetails.state_name = 'OC REJECTED BY SELLER';
              // this.buyerOCUrl = null;
            }

            else if(this.bidDetails.status == LOST) {

              this.show_await = false;
              this.show_confirm_or = false;
              this.show_await_oc = false;
              this.show_generate_oc = false;
              this.show_upload_oc = false;

              this.show_send_oc = false;
              this.isORComplete = false;
              this.isOCComplete = false;
              this.bidDetails.state_name = 'LOST';

              // this.buyerOCUrl = null;
            }

        }
      });
  }

  AmtCalculation(){
    this.bidAmount  = +this.bidDetails.your_bid;
    this.logisticAmout  = +this.auctionData.logistic_price;
    // if(this.isExWorks){
    //   this.forAmount = this.bidAmount;
    // }else{
    //   this.forAmount = this.bidAmount + this.logisticAmout;
    // }

    this.netAmount = (this.bidAmount * (+this.auctionData.lot_size)).toFixed(2);
    this.gstAmount = (this.netAmount * ((+this.auctionData.gst) / 100)).toFixed(2);
    this.grossAmount = (+this.netAmount + +this.gstAmount + +this.logisticAmout).toFixed(2);
  }

  confirmWinner()
  {
    let resp = OR_CONFIRMED_BUYER;
    this._userService.confirmORResponseBuyer({auction_id:this.auctionId,state:resp}).subscribe(
      (success: any)=>{
        if(success.success){
          this.showSuccess(success.error.message);
          this.getResult();
          // this.show_await = false;
          // this.show_confirm_or = false;
          // this.show_await_oc = false;
          // this.show_generate_oc = true;
          // this.show_send_oc = false;
          // this.isORComplete = true;
          // this.isOCComplete = false;
        } else {
          this.showDanger(success.error.message);
        }
      }
    )
  }

  getAuctionDetail(){
    this._userService.getAuctionDetail(this.auctionId)
        .subscribe((success: any)=>{
          this.auctionDetails = success.result;
          const reports = this.auctionDetails.reports;
            if(reports && reports.length > 0){
              reports.forEach((element:any) => {
                if(element.report_type == 1){
                  this.analysisReport = element.path;
                }
                if(element.report_type == 2){
                  this.concertReport = element.path;
                }
              });
            }
        },error =>{
          this.auctionDetails = null;
    });
  }

  openOCgenerateModal()
  {
    $('#modalConfirmOC').modal('show');
  }

  generateOC(e:any){
    if(e){
      this._userService.generateOC({auction_id:this.auctionId,state: OC_GENERATED})
      .subscribe((success: any)=>{
        if(success.success){
          // this.OCUrl = success.result;
          this.showSuccess(success.error.message);
          // this.show_await = false;
          // this.show_confirm_or = false;
          // this.show_await_oc = true;
          // this.show_generate_oc = false;
          // this.show_send_oc = true;
          // this.isORComplete = true;
          // this.isOCComplete = false;
          this.getResult();
        }else{
          this.showDanger(success.error.message);
        }
      });
    }
  }

  uploadOC(){
    const oc_number = $("#oc_number").val();
    if(this.OCFile){
      let fd: any = new FormData();
      fd.append('auction_id', this.auctionId);
      fd.append('state', OC_GENERATED);
      fd.append('oc', this.OCFile);
      fd.append('oc_number', oc_number);
      this._userService.generateOC(fd)
      .subscribe(success=>{
        if(success.success){
          // this.OCUrl = success.result;
          $('#uploadOcModal').modal('hide');
          this.showSuccess(success.error.message);
          // this.show_await = false;
          // this.show_confirm_or = false;
          // this.show_await_oc = true;
          // this.show_generate_oc = false;
          // this.show_send_oc = true;
          // this.isORComplete = true;
          // this.isOCComplete = false;
          this.getResult();
        }else{
          this.showDanger(success.error.message);
        }
      });
    }
  }

  uploadBuyerOc(){
    const oc_number = $("#oc_number").val();
    const oc_date = $("#oc_date").val();
    if(this.OCFile && oc_number !== '' && oc_date !== ''){
      let fd: any = new FormData();
      fd.append('auction_id', this.auctionId);
      fd.append('state', OC_GENERATED);
      fd.append('oc_file', this.OCFile);
      fd.append('oc_number', oc_number);
      fd.append('oc_date', oc_date);
      this._userService.uploadBuyerOC(fd)
      .subscribe(success=>{
        if(success.success){
          // this.OCUrl = success.result;
          $('#uploadOcModal').modal('hide');
          this.showSuccess(success.error.message);
          // this.show_await = false;
          // this.show_confirm_or = false;
          // this.show_await_oc = true;
          // this.show_generate_oc = false;
          // this.show_send_oc = true;
          // this.isORComplete = true;
          // this.isOCComplete = false;
          this.getResult();
        }else{
          this.showDanger(success.error.message);
        }
      });
    } else {
      this.showDanger('All feilds required.');
    }
  }

  sendOC(){
    this._userService.sendOC({auction_id:this.auctionId, state: OC_SENT})
    .subscribe((success: any)=>{
      if(success.success){
        this.showSuccess(success.error.message);
        // this.show_await = false;
        // this.show_confirm_or = false;
        // this.show_await_oc = true;
        // this.show_generate_oc = false;
        // this.show_send_oc = false;
        // this.isORComplete = true;
        // this.isOCComplete = false;
        this.getResult();
      }else{
        this.showDanger(success.error.message);
      }
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


  fileBrowseHandlerOC(event:any){
    const file = event.target.files[0];
    this.OCFile = file;
  }

  onCancelOCOR() {
    this.OCFile = null;
  }

  listConsignments() {
    this._userService.getConsignments(this.auctionId).subscribe(
      (success) => {
        console.log(success);
        this.consignmentList = success.result.consignments;
        // this.auctionDetails = success.result.auction_details;
      },
      (error) => {
        console.log(error);
        this.consignmentList = [];
      }
    );
  }

  getLatestBids(id:any){
    this._userService.getLatestBids(id)
      .subscribe(success => {
        if(success.success)
        {
          this.bidList = success.result.bidList;
        }
      });
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }
}
