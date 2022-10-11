import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ListingService } from 'src/app/shared/services';
import { ListComponent } from '../shared/components/list/list.component';

@Component({
  selector: 'app-sellers-list',
  templateUrl: './sellers-list.component.html',
  styleUrls: ['./sellers-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SellersListComponent implements OnInit {
  selectedData: any = {};
  sellerId: any;
  isModalOpen: boolean = false;
  isModal2Open: boolean = false;
  isModal3Open: boolean = false;
  stateList: any[] = [];

  @ViewChild(ListComponent)
  // @ts-ignore
  private listComponent: ListComponent;

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    this.fetchStateList();
  }

  fetchStateList() {
    this.listingService.getStateList().subscribe(
      (success) => {
        this.stateList = success.result;
      },
      (error) => {
        this.stateList = [];
        console.log('state list error => ', { error });
      }
    );
  }

  handleListItemClick(e: any = null) {
    this.selectedData = e;
    this.isModalOpen = true;
  }

  handlePinClick(e: any = null) {
    this.sellerId = e.userId;
    this.isModal2Open = true;
  }

  handleProductClick(e: any = null) {
    this.selectedData = e;
    this.isModal3Open = true;
  }

  handleModalClose(e: any) {
    if (e && e.refresh) {
      this.listComponent.fetchListItems();
    }
    this.isModalOpen = false;
    this.isModal2Open = false;
    this.isModal3Open = false;
    this.selectedData = null;
    this.sellerId = null;
  }
}
