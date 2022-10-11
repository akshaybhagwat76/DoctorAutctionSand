import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { BidTableComponent } from '../../shared/components/bid-table/bid-table.component';
declare let $: any;

@Component({
  selector: 'app-auction-details-live',
  templateUrl: './auction-details-live.component.html',
  styleUrls: ['./auction-details-live.component.css']
})
export class AuctionDetailsLiveComponent implements OnInit {

  auctionDetails: any;

  modalId = 'addTimeModal';
  modalData: any = {
    text: '',
    title: '',
    showCancel: true
  };
  auctionId: any;
  isListLoading: boolean = false;
  udLoading: boolean = false;
  clearTimer:boolean=false;
  auctionEndTime: any;
  analysisReport:any;
  concertReport:any;
  @Input() selectedData: any;
  @Output() backToList = new EventEmitter<any>();
  @ViewChild(BidTableComponent)
  bidTableRef!: BidTableComponent;
  constructor(private route: ActivatedRoute,private adminService: AdminService, private listingService: ListingService,
    public urlService: UrlService, private toastService: ToastService) { }

  ngOnInit(): void {
    // this.auctionId = this.route.snapshot.params.id;
    console.log(this.selectedData);
    this.auctionId = this.selectedData.id;
    this.getAuctionDetails();
  }

  ngOnDestroy():void{
    this.clearTimer = true;
  }

  getAuctionDetails() {

    this.adminService.getAuctionDetail(this.auctionId).subscribe(
      (succ) => {
        this.auctionDetails = succ.result;
        const reports = this.auctionDetails.reports;
        this.auctionEndTime = this.auctionDetails.end_time;

        this.runTimer();
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

  onAuctionEnd() {
    if (this.bidTableRef) {
      this.bidTableRef.ngOnDestroy();
    }
    this.modalId = 'auctionEndModal';
    this.modalData = {
      title: 'Auction Ended',
      text: 'The auction has been completed.',
      showCancel: false
    };
    $('#' + this.modalId).modal('show');
    // this.back2List(true);

  }


  // handle back to list
  back2List(refresh: boolean = false) {
    this.backToList.emit({ refresh });
  }


  showExtendPopUp()
  {
    this.modalId = 'addTimeModal';
    this.modalData.text = 'Are you sure you want to extend time by 5 minutes?'
    this.modalData.title = 'Extend Time';
    $('#' + this.modalId).modal('show');
  }

  confirmModalResponse(res: boolean) {
    if(this.modalId == 'auctionEndModal') {
      let refresh: boolean = true;
      this.backToList.emit({ refresh });
    } else {
      if(res) {
        this.extendTime();
      }
    }
  }

  extendTime(){
    this.clearTimer = true;
    this.listingService.extendAuctionTime(this.auctionId).subscribe(
      (success) => {
        this.clearTimer = false;
        if(success.success) {
          this.getAuctionDetails();
          this.showSuccess(success.error.message);
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

//   runTimer() {
//   // Update the count down every 1 second
//     var x = setInterval(()=> {
//       if(this.clearTimer){
//         clearInterval(x);
//       }
//       var countDownDate = new Date(this.auctionEndTime).getTime();
//       // Get today's date and time
//       var now = new Date().getTime();
//       // Find the distance between now and the count down date
//       var distance = countDownDate - now;
//       // Time calculations for days, hours, minutes and seconds
//       // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       let h = hours <= 0 ? '00' : hours.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
//       let m = minutes <= 0 ? '00' : minutes.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
//       let s = seconds <= 0 ? '00' : seconds.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
//       this.selectedData.time = h + " : " + m + " : " + s;
//       // If the count down is finished, write some text
//       if (distance < 0) {
//         this.onAuctionEnd();
//         clearInterval(x);
//       }
//     }, 1000);
// }

  runTimer() {
    var countDownDate = moment(this.auctionDetails.end_time, "HH:mm:ss");
    // Update the count down every 1 second
    var x = setInterval(()=> {
      countDownDate.subtract(1, 'seconds');
      this.auctionDetails.time = countDownDate.format('HH:mm:ss');
      if (countDownDate.get('hours') == 0 && countDownDate.get('minutes') == 0 && countDownDate.get('seconds') == 0) {
        clearInterval(x);
        this.onAuctionEnd();
      }
      if(this.clearTimer){
        clearInterval(x);
      }
    }, 1000);
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }
}
