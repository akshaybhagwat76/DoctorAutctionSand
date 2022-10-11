import { Component, OnInit } from '@angular/core';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { UrlService } from 'src/app/shared/services/url.service';
declare let $: any;
import {
  REGISTERD_BID,
  AWAITING_RESULT,
  LOST,
  OR_CONFIRMED_BUYER,
  OR_SENT,
  AWAITING_OR,
  OR_REJECTED_SELLER,
  OR_CONFIRMED_SELLER,
  OC_GENERATED,
  OC_CONFIRMED_SELLER,
  OR_REJECTED_BUYER,
  OC_REJECTED_SELLER
} from 'src/app/shared/constants';
import { element } from 'protractor';
import * as moment from 'moment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  auctionList: any;
  sandTypeList: any[] = [];
  locationList: any[] = [];
  locationId = 0;
  isCompleted = 0;
  selectedSandType: any = 0;
  liveAuctionExists: boolean = false;
  upcomingAuctionExists: boolean = false;

  constructor(private _userService: UserService,
              private listingService: ListingService,
              private adminService: AdminService,
              public urlService: UrlService,
              private router: Router) {
                  // localStorage.setItem('dashboard_stage', '1');
                  var isCompleted = localStorage.getItem('dashboard_stage');
                  // console.log('isCompleted',isCompleted);
                  // if(isCompleted && isCompleted == '1')
                  // {
                  //   this.isCompleted = 1;
                  // }
                  this.isCompleted = isCompleted ? +isCompleted : 0;
               }

  ngOnInit(): void {
    this.getBuyerAuctionList(this.locationId, this.isCompleted);
    this.listSandType();
    this.listLocation();
  }

  getBuyerAuctionList(location_id: any, isCompleted: any) {
    localStorage.setItem('dashboard_stage',(isCompleted == 1)?'1':'0');
    this.locationId = location_id;
    this.isCompleted = isCompleted;
    this.upcomingAuctionExists = false;
    this.liveAuctionExists = false;
    this._userService.getBuyerAuctions({location_id: location_id, is_completed: isCompleted, product_id: this.selectedSandType})
        .subscribe(success=>{
          console.log(success.result);
          this.auctionList = success.result;

          if(isCompleted == 1 && this.auctionList.length > 0){
            this.auctionList.forEach((element:any) => {
              switch(element.bid_state)
              {
                case OR_CONFIRMED_SELLER:
                  element.status = 'OR CONFIRMED BY SELLER';
                  element.color_css = 'auction-btn';
                  break;
                case OR_CONFIRMED_BUYER:
                  element.status = 'OR CONFIRMED BY YOU';
                  element.color_css = 'auction-btn';
                  break;
                case OC_GENERATED:
                  element.status = 'OR GENERATED';
                  element.color_css = 'auction-btn';
                  break;
                case OC_CONFIRMED_SELLER:
                  element.status = 'WON';
                  element.color_css = 'auction-won-btn';
                  break;
                case OR_SENT:
                    element.status = 'OR REQUESTED';
                    element.color_css = 'auction-won-btn';
                    break;
                case AWAITING_RESULT:
                  element.status = 'AWAITING RESULT';
                  element.color_css = 'auction-btn';
                  break;
                case AWAITING_OR:
                  element.status = 'AWAITING OR';
                  element.color_css = 'auction-btn';
                  break;
                case OR_REJECTED_SELLER:
                case OR_REJECTED_BUYER:
                  element.status = 'OR REJECTED';
                  element.color_css = 'auction-lost-btn';
                  break;
                case OC_REJECTED_SELLER:
                  element.status = 'OC REJECTED';
                  element.color_css = 'auction-lost-btn';
                  break;
                case LOST:
                  element.status = 'LOST';
                  element.color_css = 'auction-lost-btn';
                  break;
                  default:
                    element.status = 'AWAITING RESULT';
                    element.color_css = 'auction-btn';
                    break;
              }
            });
          } else {
            if(this.auctionList && this.auctionList.upcoming && this.auctionList.upcoming.length > 0) {
              this.auctionList.upcoming.forEach((element: any) => {
                element.timer = this.runTimer(element.time, element);
                if(!element.is_private || (element.is_private && element.is_invited)){
                  this.upcomingAuctionExists = true;
                }
              });
            }
            if(this.auctionList && this.auctionList.Registered && this.auctionList.Registered.length > 0) {
              this.auctionList.Registered.forEach((element: any) => {
                element.timer = this.runTimer(element.time, element);
              });
            }
            if(this.auctionList && this.auctionList.live && this.auctionList.live.length > 0) {
              this.auctionList.live.forEach((element: any) => {
                element.timer = this.runTimer(element.time, element);
                if(!element.is_private || (element.is_private && element.is_invited)){
                  this.liveAuctionExists = true;
                }
              });
            }
          }
        },error =>{
          this.auctionList = [];
    });
  }

  // runTimer(time: any, element: any) {
  //   // var countDownDate = new Date(time).getTime();
  //   // var countDownDate = Date.parse(time);

  //   // Have to split time funny for IOS and Safari NAN and timezone bug
  //   var timeParsed:any = time.replace(' ', 'T').split(/[^0-9]/);
  //   var countDownDate = new Date(new Date (timeParsed[0],timeParsed[1]-1,timeParsed[2],timeParsed[3],timeParsed[4],timeParsed[5])).getTime();
  // // Update the count down every 1 second
  //   var x = setInterval(()=> {
  //     // Get today's date and time
  //     var now = new Date().getTime();
  //     // Find the distance between now and the count down date
  //     var distance = countDownDate - now;
  //     // Time calculations for days, hours, minutes and seconds
  //     // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //     var hours: any = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //     var minutes: any = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //     var seconds: any = Math.floor((distance % (1000 * 60)) / 1000);
  //     hours = hours <= 0 ? '00' : hours.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
  //     minutes = minutes <= 0 ? '00' : minutes.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
  //     seconds = seconds <= 0 ? '00' : seconds.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
  //     // $('#hour-label-' + id).html(hours);
  //     // $('#min-label-' + id).html(minutes);
  //     // $('#sec-label-' + id).html(seconds);
  //     // If the count down is finished, write some text
  //     if (distance < 0) {
  //       clearInterval(x);
  //       this.getBuyerAuctionList(this.locationId, this.isCompleted);
  //     }
  //     element.time = hours + ':' + minutes + ':' + seconds;
  //   }, 1000);
  // }

  runTimer(time: any, element: any) {
    var countDownDate = moment(time, "HH:mm:ss");
  // Update the count down every 1 second
    var x = setInterval(()=> {
      countDownDate.subtract(1, 'seconds');
      element.timer = countDownDate.format('HH:mm:ss');
      if (countDownDate.get('hours') == 0 && countDownDate.get('minutes') == 0 && countDownDate.get('seconds') == 0) {
        clearInterval(x);
        this.getBuyerAuctionList(this.locationId, this.isCompleted);
      }
    }, 1000);
  }

  listSandType() {
    this.listingService.getSandTypeList().subscribe(
      (success) => {
        let obj = {
          id : 0,
          name : "All"
        };
        console.log(success);
        this.sandTypeList = success.result;
        this.sandTypeList.unshift(obj);
      },
      (error) => {
        console.log(error);
        this.sandTypeList = [];
      }
    );
  }

  listLocation() {
    this.adminService.getLocationList().subscribe(
      (success) => {
        console.log(success);
        this.locationList = success.result;
        let obj = {
          id : 0,
          location_name : "All"
        };
        this.locationList.unshift(obj);
      },
      (error) => {
        console.log(error);
        this.locationList = [];
      }
    );
  }

  liveLinkClick(item:any){
    localStorage.setItem('dashboard_stage', '0');
    if(item.bid_state == REGISTERD_BID){
      this.router.navigateByUrl('/user/auction/bid/'+item.id);
    }else{
      this.router.navigateByUrl('/user/auction/live/'+item.id);
    }
  }

  completedLinkClick(item:any){
    localStorage.setItem('dashboard_stage', '1');
    if(item.bid_state >= OR_CONFIRMED_SELLER && item.bid_state != LOST){
      this.router.navigateByUrl('/user/auction/won/'+item.id);
    }else{
      // this.router.navigateByUrl('/user/auction/bid-result/'+item.id);
    }
  }

}
