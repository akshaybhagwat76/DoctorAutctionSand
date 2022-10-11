import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ROLE_ID_ADMIN, ROLE_ID_RETAILER } from 'src/app/shared/constants';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent implements OnInit {
  @Input() listType: 'SELLER' | 'BUYER' | '' = '';
  @Output() onListItemClick = new EventEmitter<any>();
  @Output() onPinClick = new EventEmitter<any>();
  @Output() onProductClick = new EventEmitter<any>();

  listItems: any[] = [];
  listItemsTemp: any[] = [];
  isListLoading: boolean = false;
  fromDate: any = new Date();
  toDate: any = new Date();
  isAll: boolean = true;
  datePipe: any = new DatePipe('en-US');

  registStatusList: any[] = [];

  filterDropdown: any;

  constructor(private adminServices: AdminService) {}

  ngOnInit(): void {
    this.fetchListItems();
  }

  fetchListItems() {
    this.registStatusList = [];
    this.isListLoading = true;
    this.adminServices
      .usersList({
        type: this.listType,
        fromDate: this.fromDate
          ? this.datePipe.transform(this.fromDate, 'YYYY-MM-dd HH:mm')
          : '',
        toDate: this.toDate
          ? this.datePipe.transform(this.toDate, 'YYYY-MM-dd HH:mm')
          : '',
        isAll: this.isAll,
      })
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.listItems = this.parseListItems(res.result);
            this.listItemsTemp = this.listItems;
          } else {
            this.listItems = [];
          }
          this.isListLoading = false;
        },
        (err) => {
          this.listItems = [];
          this.isListLoading = false;
        }
      );
  }

  parseListItems(listData: any): any[] {
    let result: any[] = [];

    if (!listData || !listData.length) {
      return result;
    }

    listData.forEach((item: any) => {
      const res = {
        id: item.id ? item.id : '',
        registrationId: item.login_id ? item.login_id : '',
        companyName: item.name ? item.name : '',
        phoneNumber: item.mobile ? item.mobile : '',
        email: item.email ? item.email : '',
        date: item.created_on ? item.created_on : '',
        status: item.registration_status ? item.registration_status : '',
        userId: item.user_id ? item.user_id : '',
        roleId: item.role_id ? item.role_id : '',
      };

      //create registStatusList for filtering
      let isExist = this.registStatusList.find(x => x.name == res.status);
      if(!isExist) {
        this.registStatusList.push({name: res.status, value: res.status});
      }

      if (res.roleId !== ROLE_ID_ADMIN && res.roleId !== ROLE_ID_RETAILER) {
        result.push(res);
      }
    });
    console.log(this.registStatusList);

    return result;
  }

  handleListItemClick(e: any) {
    this.onListItemClick.emit(e);
  }

  handlePinClick(e: any) {
    this.onPinClick.emit(e);
  }

  handleProductClick(e: any) {
    this.onProductClick.emit(e);
  }

  handleFilterClick(e: any, type: string) {
    const dateNow = new Date();
    this.isAll = false;

    switch (type) {
      case 'pastHour':
        this.fromDate = new Date(dateNow.getTime() - 60 * 60 * 1000);
        this.toDate = dateNow;
        break;

      case 'past24Hour':
        this.isAll = false;
        this.fromDate = new Date(dateNow.getTime() - 24 * 60 * 60 * 1000);
        this.toDate = dateNow;
        break;

      case 'pastWeek':
        this.fromDate = new Date(dateNow.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.toDate = dateNow;
        break;

      case 'pastMonth':
        const pastMonth = new Date();
        this.fromDate = new Date(pastMonth.setMonth(pastMonth.getMonth() - 1));
        this.toDate = dateNow;
        break;

      case 'pastYear':
        const pastYear = new Date();
        this.fromDate = new Date(
          pastYear.setFullYear(pastYear.getFullYear() - 1)
        );
        this.toDate = dateNow;
        break;

      case 'range':
      case 'all':
      default:
        this.fromDate = '';
        this.toDate = '';
        this.isAll = true;
        break;
    }

    this.fetchListItems();
  }

  handleStatusFilterClick(e: any) {
    if(e && e.value) {
      let filteredList = this.listItems.filter(x => x.status == e.value);
      this.listItemsTemp = filteredList;
    } else {
      this.listItemsTemp = this.listItems;
    }
  }
}
