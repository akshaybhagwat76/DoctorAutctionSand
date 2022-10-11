import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UrlService } from 'src/app/shared/services/url.service';
import {
  REGISTERD_BID,
  AWAITING_RESULT,
  OR_GENERATED,
  OR_CONFIRMED_SELLER,
  OR_SENT,
  OR_CONFIRMED_BUYER,
  OC_GENERATED,
  OC_CONFIRMED_SELLER,
  OC_SENT,
  CONSIGNMENT_ADDED,
  DC_GENERATED,
  DC_ACCEPTED,
  INVOICE_GENERATED,
  SECURITY_DEPOSIT_ENABLED,
  OC_REJECTED_SELLER
} from 'src/app/shared/constants';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {

  modalId = 'confirmModal';
  modalData: any = {
    text: '',
    title: ''
  };
  dcModalId = 'confirmDCModal';
  dcModalData: any = {
    text: '',
    title: ''
  };
  approveOCModalData: any = {
    text: '',
    title: ''
  };
  releaseSDModalData: any = {
    text: '',
    title: ''
  };
  auctionId: any;
  sellerObj:any;
  buyerList:any[] = [];
  sellerNotified:boolean = false;
  sellerConfirmed: boolean = false;
  prSent: boolean = false;
  prAccepted: boolean = false;
  // sellerNoticationText :string = 'Seller not notified';
  sellerNoticationText :string = 'No file generated';
  sendPRText :string = 'PR not sent';
  buyerName :string = '';
  selectedBuyerId : any;
  rejectedBuyers: any[] = [];
  auctionDetails: any;
  analysisReport:any;
  concertReport:any;

  showGenerateOR: boolean = false;
  showAwaitingForSellerToAcceptOR: boolean = false;
  showSendOR: boolean = false;
  showAwaitingForBuyerToAcceptOR: boolean = false;
  showGenerateOC: boolean = false;
  showSendOC: boolean = false;
  showAwaitingForSellerToAcceptOC: boolean = false;

  isOrderRequestComplete: boolean = false;
  isOrderConfirmationComplete: boolean = false;

  consignmentList: any = [];
  deliveryText: any = '';
  tncText: any = '';
  paymentText: any = '';

  ORFile: any;
  OCFile: any;

  ORUrl: any;
  OCUrl: any;
  buyerOCUrl: any;
  buyerOCId: any;
  buyerOCApproved: any = 0;

  isModalOpen: boolean = false;

  isModalOpen2: boolean = false;

  selectedConsignmentId: any;
  consignmentNo: number = 0;
  consignmentAdded = CONSIGNMENT_ADDED;
  dcGenerated = DC_GENERATED;
  dcAccepted = DC_ACCEPTED;
  invoiceGenerated = INVOICE_GENERATED;
  bidDetails: any;
  isSDEnabled = SECURITY_DEPOSIT_ENABLED;

  constructor(private route: ActivatedRoute,private adminService: AdminService,
    private userService: UserService,
    public urlService: UrlService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.auctionId = this.route.snapshot.params.id;
    this.getAuctionWinners();
    this.getAuctionDetails();
    this.getStaticContent();
  }

  async getAuctionDetails() {

    await this.adminService.getAuctionDetail(this.auctionId).subscribe(
      (succ) => {
        this.auctionDetails = succ.result;
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
      },
      (fail) => {
        this.auctionDetails = null;
      }
    );
  }

  getAuctionWinner() {
    this.userService.getResult(this.auctionId)
    .subscribe(success=>{
      if(success.success){
        console.log(success.result);
        this.bidDetails = success.result;
        this.bidDetails.bid_state = this.bidDetails.status;
        this.stateResult(this.bidDetails);
      }},
      (fail) => {
        this.bidDetails = null;
      });
  }

  getAuctionWinners(){
    this.rejectedBuyers = [];
    this.adminService.getAuctionWinners({auction_id:this.auctionId})
      .subscribe(success=>{
        if(success.success){
          const result = success.result;
          this.sellerObj = result.auction_data;
          this.buyerList = result.buyers;
          this.ORUrl = result.or_url;
          this.OCUrl = result.oc_url;
          this.buyerOCUrl = result.buyer_oc_url;
          this.buyerOCApproved = result.buyer_oc_approved;
          this.buyerOCId = result.buyer_oc_id;

          console.log(this.buyerList);

          this.showAwaitingForSellerToAcceptOR = false;
          this.showSendOR = false;
          this.showAwaitingForBuyerToAcceptOR = false;
          this.showGenerateOC = false;
          this.showAwaitingForSellerToAcceptOC = false;
          this.showGenerateOR = false;
          this.isOrderRequestComplete = false;
          this.isOrderConfirmationComplete = false;
          if(result && result.buyers && result.buyers.length && result.buyers.length > 0) {
            this.showGenerateOR = true;
            result.buyers.forEach((element:any) => {
              this.stateResult(element);
            });
          } else {
            this.showGenerateOR = false;
          }
        } else {
          this.buyerList = [];
        }
      },
      (fail) => {
        this.buyerList = [];
      });
  }

  stateResult(element: any) {
    if(element.bid_state != REGISTERD_BID && element.bid_state != AWAITING_RESULT) {

      // this.selectedBuyerId = element.buyer_id;
      // this.buyerName = element.name;

      if(element.bid_state == OR_GENERATED) {

        this.showGenerateOR = false;
        this.showSendOR = false;
        this.showAwaitingForBuyerToAcceptOR = false;
        this.showGenerateOC = false;
        this.showAwaitingForSellerToAcceptOC = false;
        this.showSendOC = false;
        this.showAwaitingForSellerToAcceptOR = true;
        this.isOrderRequestComplete = false;
        this.isOrderConfirmationComplete = false;

      } else if(element.bid_state == OR_CONFIRMED_SELLER) {

        this.showGenerateOR = false;
        this.showAwaitingForSellerToAcceptOR = false;
        this.showAwaitingForBuyerToAcceptOR = false;
        this.showGenerateOC = false;
        this.showAwaitingForSellerToAcceptOC = false;
        this.showSendOC = false;
        this.showSendOR = true;
        this.isOrderRequestComplete = false;
        this.isOrderConfirmationComplete = false;

        this.selectedBuyerId = element.buyer_id;
        this.buyerName = element.name;

      } else if(element.bid_state == OR_SENT) {

        this.showGenerateOR = false;
        this.showAwaitingForSellerToAcceptOR = false;
        this.showSendOR = false;
        this.showGenerateOC = false;
        this.showAwaitingForSellerToAcceptOC = false;
        this.showSendOC = false;
        this.showAwaitingForBuyerToAcceptOR = true;
        this.isOrderRequestComplete = false;
        this.isOrderConfirmationComplete = false;
        this.selectedBuyerId = element.buyer_id;
        this.buyerName = element.name;

      } else if(element.bid_state == OR_CONFIRMED_BUYER) {

        this.showGenerateOR = false;
        this.showAwaitingForSellerToAcceptOR = false;
        this.showSendOR = false;
        this.showAwaitingForBuyerToAcceptOR = false;
        this.showAwaitingForSellerToAcceptOC = false;
        this.showSendOC = false;
        this.showGenerateOC = true;
        this.isOrderRequestComplete = true;
        this.isOrderConfirmationComplete = false;
        // this.getAuctionWinner();
        this.selectedBuyerId = element.buyer_id;
        this.buyerName = element.name;

      } else if(element.bid_state == OC_GENERATED) {

        this.showGenerateOR = false;
        this.showAwaitingForSellerToAcceptOR = false;
        this.showSendOR = false;
        this.showAwaitingForBuyerToAcceptOR = false;
        this.showGenerateOC = false;
        this.showAwaitingForSellerToAcceptOC = false;
        this.showSendOC = true;
        this.isOrderRequestComplete = true;
        this.isOrderConfirmationComplete = false;
        this.selectedBuyerId = element.buyer_id;
        this.buyerName = element.name;

      }else if(element.bid_state == OC_SENT) {
        this.showGenerateOR = false;
        this.showAwaitingForSellerToAcceptOR = false;
        this.showSendOR = false;
        this.showGenerateOC = false;
        this.showAwaitingForSellerToAcceptOC = true;
        this.showAwaitingForBuyerToAcceptOR = false;
        this.showSendOC = false;
        this.isOrderRequestComplete = true;
        this.isOrderConfirmationComplete = false;
        this.selectedBuyerId = element.buyer_id;
        this.buyerName = element.name;

      } else if(element.bid_state == OC_CONFIRMED_SELLER) {

        this.showGenerateOR = false;
        this.showAwaitingForSellerToAcceptOR = false;
        this.showSendOR = false;
        this.showAwaitingForBuyerToAcceptOR = false;
        this.showGenerateOC = false;
        this.showAwaitingForSellerToAcceptOC = false;
        this.showSendOC = false;
        this.isOrderRequestComplete = true;
        this.isOrderConfirmationComplete = true;
        this.listConsignments();
        this.selectedBuyerId = element.buyer_id;
        this.buyerName = element.name;
      }
      else if(element.bid_state == OC_REJECTED_SELLER) {
        this.rejectedBuyers.push(element.buyer_id);
      }
    }
  }


  generateOR(){
    const buyer_id = $("input[type='radio'][name='buyer']:checked").val();
    if(buyer_id){
      this.adminService.generateOR({auction_id:this.auctionId,buyer_id:buyer_id})
      .subscribe(success=>{
        if(success.success){
          console.log(success);
          this.ORUrl = success.result;
          $('#buyerModal').modal('hide');
          this.showSuccess(success.error.message);
          this.showGenerateOR = false;
          this.showSendOR = false;
          this.showAwaitingForBuyerToAcceptOR = false;
          this.showGenerateOC = false;
          this.showAwaitingForSellerToAcceptOC = false;
          this.showSendOC = false;
          this.showAwaitingForSellerToAcceptOR = true;
          this.isOrderRequestComplete = false;
          this.isOrderConfirmationComplete = false;
        }else{
          this.showDanger(success.error.message);
        }
      });
    }
  }

  uploadOR(){
    const buyer_id = $("input[type='radio'][name='up-buyer']:checked").val();
    const or_number = $("#or_number").val();

    if(buyer_id && this.ORFile){
      let fd = new FormData();
      fd.append('auction_id', this.auctionId);
      fd.append('buyer_id', buyer_id);
      fd.append('or', this.ORFile);
      fd.append('or_number', or_number);
      this.adminService.generateOR(fd)
      .subscribe(success=>{
        if(success.success){
          $('#uploadOrModal').modal('hide');
          console.log(success);
          this.ORUrl = success.result;
          this.showSuccess(success.error.message);
          this.showGenerateOR = false;
          this.showSendOR = false;
          this.showAwaitingForBuyerToAcceptOR = false;
          this.showGenerateOC = false;
          this.showAwaitingForSellerToAcceptOC = false;
          this.showSendOC = false;
          this.showAwaitingForSellerToAcceptOR = true;
          this.isOrderRequestComplete = false;
          this.isOrderConfirmationComplete = false;
        }else{
          this.showDanger(success.error.message);
        }
      });
    }
  }

  sendOR(){
    // const buyer_id = $("input[type='radio'][name='buyer']:checked").val();
    if(this.selectedBuyerId > 0){
      this.adminService.sendOR({auction_id:this.auctionId,buyer_id:this.selectedBuyerId, state: OR_SENT})
      .subscribe(success=>{
        if(success.success){
          $('#sendprModal').modal('hide');
          this.showSuccess(success.error.message);
          this.showGenerateOR = false;
          this.showAwaitingForSellerToAcceptOR = false;
          this.showSendOR = false;
          this.showGenerateOC = false;
          this.showAwaitingForSellerToAcceptOC = false;
          this.showSendOC = false;
          this.showAwaitingForBuyerToAcceptOR = true;
          this.isOrderRequestComplete = false;
          this.isOrderConfirmationComplete = false;
        }else{
          this.showDanger(success.error.message);
        }
      });
    }
  }

  openConfirmModalOC()
  {
    this.modalData = {
      title: 'Generate OC',
      text: 'Are you sure you want to generate OC?'
    };
    $('#' + this.modalId).modal('show');
  }

  confirmModalResponse(e:any)
  {
    if(e){
      this.generateOC();
    }
  }

  generateOC(){
    this.userService.generateOC({auction_id:this.auctionId,state: OC_GENERATED})
    .subscribe(success=>{
      if(success.success){
        // this.OCUrl = success.result;
        this.showSuccess(success.error.message);
        // this.showGenerateOR = false;
        // this.showSendOR = false;
        // this.showAwaitingForBuyerToAcceptOR = false;
        // this.showGenerateOC = false;
        // this.showAwaitingForSellerToAcceptOC = false;
        // this.showSendOC = true;
        // this.showAwaitingForSellerToAcceptOR = false;
        // this.isOrderRequestComplete = true;
        // this.isOrderConfirmationComplete = false;
        this.getAuctionWinners();
      }else{
        this.showDanger(success.error.message);
      }
    });
  }

  uploadOC(){
    const oc_number = $("#oc_number").val();
    if(this.OCFile){
      let fd: any = new FormData();
      fd.append('auction_id', this.auctionId);
      fd.append('state', OC_GENERATED);
      fd.append('oc', this.OCFile);
      fd.append('oc_number', oc_number);
      this.userService.generateOC(fd)
      .subscribe(success=>{
        if(success.success){
          // this.OCUrl = success.result;
          $('#uploadOcModal').modal('hide');
          this.showSuccess(success.error.message);
          // this.showGenerateOR = false;
          // this.showSendOR = false;
          // this.showAwaitingForBuyerToAcceptOR = false;
          // this.showGenerateOC = false;
          // this.showAwaitingForSellerToAcceptOC = false;
          // this.showSendOC = true;
          // this.showAwaitingForSellerToAcceptOR = false;
          // this.isOrderRequestComplete = true;
          // this.isOrderConfirmationComplete = false;
          this.getAuctionWinners();
        }else{
          this.showDanger(success.error.message);
        }
      });
    }
  }

  sendOC(){
    this.userService.sendOC({auction_id:this.auctionId, state: OC_SENT})
    .subscribe(success=>{
      if(success.success){
        this.showSuccess(success.error.message);
        // this.showGenerateOR = false;
        // this.showAwaitingForSellerToAcceptOR = false;
        // this.showSendOR = false;
        // this.showGenerateOC = false;
        // this.showAwaitingForSellerToAcceptOC = true;
        // this.showAwaitingForBuyerToAcceptOR = false;
        // this.showSendOC = false;
        // this.isOrderRequestComplete = true;
        // this.isOrderConfirmationComplete = false;
        this.getAuctionWinners();
      }else{
        this.showDanger(success.error.message);
      }
    });
  }

  listConsignments() {
    this.adminService.getConsignments(this.auctionId).subscribe(
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

  getStaticContent()
  {
    this.userService.getStaticText()
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

  fileBrowseHandlerOR(event:any){
    const file = event.target.files[0];
    this.ORFile = file;
  }

  fileBrowseHandlerOC(event:any){
    const file = event.target.files[0];
    this.OCFile = file;
  }

  onCancelOCOR() {
    this.OCFile = null;
    this.ORFile = null;
  }

  openConfirmModalDC(id: any)
  {
    this.selectedConsignmentId = id;
    this.dcModalData = {
      title: 'Generate DC',
      text: 'Are you sure you want to generate DC?'
    };
    $('#' + this.dcModalId).modal('show');
  }

  confirmDCModalResponse(e:any)
  {
    if(e){
      this.generateDC();
    }
  }

  openConfirmModalApproveOC()
  {
    this.approveOCModalData = {
      title: 'Approve Buyer OC',
      text: 'Are you sure you want to approve buyer OC?'
    };
    $('#confirmApproveOCModal').modal('show');
  }

  confirmApproveOCModalResponse(e:any)
  {
    if(e){
      this.approveBuyerOC();
    }
  }

  generateDC(){
    this.adminService.generateDC(this.selectedConsignmentId)
    .subscribe(success=>{
      if(success.success){
        this.listConsignments();
        this.showSuccess(success.error.message);
        // this.showGenerateOR = false;
        // this.showSendOR = false;
        // this.showAwaitingForBuyerToAcceptOR = false;
        // this.showGenerateOC = false;
        // this.showAwaitingForSellerToAcceptOC = false;
        // this.showSendOC = false;
        // this.showAwaitingForSellerToAcceptOR = false;
        // this.isOrderRequestComplete = true;
        // this.isOrderConfirmationComplete = true;
      }else{
        this.showDanger(success.error.message);
      }
    });
  }

  handleModalClose(e: any) {
    if (e && e.refresh) {
      this.listConsignments();
    }
    if(e && e.data) {
      // this.showSuccess(e.data.body);
    }
    this.isModalOpen = false;
    this.selectedConsignmentId = null;
  }

  handleEnterAcceptedDCClick(e: any = null) {
    this.selectedConsignmentId = e;
    this.isModalOpen = true;
  }

  handleModalClose2(e: any) {
    if (e && e.refresh) {
      this.listConsignments();
    }
    if(e && e.data) {
    }
    this.isModalOpen2 = false;
    this.selectedConsignmentId = null;
  }

  handleGenerateInvoiceClick(e: any = null, i: number) {
    this.selectedConsignmentId = e;
    this.consignmentNo = i;
    this.isModalOpen2 = true;
  }

  approveBuyerOC(){
    this.adminService.approveBuyerOC({buyer_oc_id: this.buyerOCId, auction_id: this.auctionId})
    .subscribe(success=>{
      if(success.success){
        this.showSuccess(success.error.message);
        this.buyerOCApproved = 1;
      }else{
        this.showDanger(success.error.message);
      }
    });
  }

  openConfirmModalSDRelease(SDAmount: any)
  {
    this.releaseSDModalData = {
      title: 'Release buyer security deposit amount',
      text: 'Are you sure you want to release buyer security deposit amount of INR ' + Number(SDAmount).toLocaleString() + ' ?'
    };
    $('#confirmReleaseSDModal').modal('show');
  }

  confirmSDReleaseModalResponse(e:any)
  {
    if(e){
      this.relaeseBuyerSD();
    }
  }

  relaeseBuyerSD(){
    this.adminService.releaseBuyerSD({buyer_id: this.selectedBuyerId, auction_id: this.auctionId})
    .subscribe(success=>{
      if(success.success){
        this.showSuccess(success.error.message);
        this.getAuctionWinners();
      }else{
        this.showDanger(success.error.message);
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
