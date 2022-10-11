import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ListingService } from 'src/app/shared/services';
import { ListComponent } from '../shared/components/list/list.component';

@Component({
  selector: 'app-buyers-list',
  templateUrl: './buyers-list.component.html',
  styleUrls: ['./buyers-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BuyersListComponent implements OnInit {
  selectedData: any = {};
  isModalOpen: boolean = false;
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

  handleModalClose(e: any) {
    if (e && e.refresh) {
      this.listComponent.fetchListItems();
    }
    this.isModalOpen = false;
    this.selectedData = null;
  }
}
