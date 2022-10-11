import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { COMPLETED, LIVE, UPCOMING } from 'src/app/shared/constants';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ListComponent } from '../../shared/components/list/list.component';

declare let $: any;
@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css']
})
export class AuctionListComponent implements OnInit {

  selectedData: any = {};
  isModalOpen: boolean = false;
  isModalOpen2: boolean = false;
  auctionList: any[] = [];
  productList: any[] = [];
  isListLoading = false;
  currentState = UPCOMING;
  selectedAuctionId : any;

  COMPLETEDSTATE = COMPLETED;
  UPCOMINGSTATE = UPCOMING;
  LIVESTATE = LIVE;

  locationList: any[] = [];
  selectedLocationId = 0;
  selectedProductId = 0;
  dateFilter: string = 'all';
  @ViewChild(ListComponent)
  // @ts-ignore
  private listComponent: ListComponent;

  constructor(private adminService: AdminService,
              private listingService: ListingService) {}

  ngOnInit(): void {
    this.fetchAuctionList();
    this.listProducts();
    this.listLocation();
  }

  fetchAuctionList() {
    // this.dateFilter = dateFilter;
    // this.currentState = state;
    this.isListLoading = true;
    this.adminService.getAuctionList(
      {state: this.currentState,
      date_filter: this.dateFilter,
      product_id: this.selectedProductId,
      location_id: this.selectedLocationId
      }).subscribe(
      (success) => {
        this.isListLoading = false;
        if(success.success) {
          this.auctionList = success.result;
          this.auctionList.forEach((e: any) => {
            e.from_datetime = moment(e.from_datetime);
            e.to_datetime = moment(e.to_datetime);
          });
        } else {
          this.auctionList = [];
        }
      },
      (error) => {
        this.isListLoading = false;
        this.auctionList = [];
        console.log('state list error => ', { error });
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

  onUpcoming() {
    this.currentState = this.UPCOMINGSTATE;
    this.fetchAuctionList();
  }

  onLive() {
    this.currentState = this.LIVESTATE;
    this.fetchAuctionList();
  }

  onCompleted() {
    this.currentState = this.COMPLETEDSTATE;
    this.fetchAuctionList();
  }

  listProducts() {
    this.listingService.getSandTypeList().subscribe(
      (success) => {
        console.log(success);
        this.productList = success.result;
        let obj = {
          id : 0,
          name : "All"
        };
        this.productList.unshift(obj);
      },
      (error) => {
        console.log(error);
        this.productList = [];
      }
    );
  }

  handleListItemClick(e: any = null) {
    this.selectedData = e;
    this.isModalOpen = true;
  }

  handleModalClose(e: any) {
    if (e && e.refresh) {
      this.fetchAuctionList();
    }
    this.isModalOpen = false;
    this.isModalOpen2 = false;
    this.selectedData = null;
  }

  // onProductChange(e: any) {
  //   console.log(e);
  //   if(e){
  //     this.fetchAuctionList(this.currentState,'',e.id);
  //   }else{
  //     this.fetchAuctionList(this.currentState);
  //   }
  // }

  // onLocationChange(e: any) {
  //   console.log(e);
  //   if(e){
  //     this.fetchAuctionList(this.currentState,'',e.id);
  //   }else{
  //     this.fetchAuctionList(this.currentState);
  //   }
  // }

  handleFilterClick(type: string) {
    this.dateFilter = type;
    this.fetchAuctionList();
  }

  showExtendPopUp(id:any)
  {
    this.selectedAuctionId = id;
    $("#confirmModel").modal('show');
  }

  extendTime(){
    this.listingService.extendAuctionTime(this.selectedAuctionId).subscribe(
      (success) => {
        console.log(success);
        $("#confirmModel").modal('hide');
        this.fetchAuctionList();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleViewClick(e: any) {
    this.selectedData = e;
    this.isModalOpen = true;
  }

  handleLiveViewClick(e: any) {
    this.selectedData = e;
    this.isModalOpen2 = true;
  }
}
