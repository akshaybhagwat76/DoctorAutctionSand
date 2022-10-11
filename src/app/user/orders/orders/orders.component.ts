import { Component, OnInit } from '@angular/core';
import { SELLER_CONFIRMED, BUYER_ACCEPTED } from 'src/app/shared/constants';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  isListLoading: boolean = false;
  orderList: any[] = [];
  currentPage: any;
  total: any;
  orderStatusList: any[] = [];
  sellerConfirmed = SELLER_CONFIRMED;
  orderAccepted = BUYER_ACCEPTED;
  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    this.getOrderStatusList();
    this.getOrderList();
    this.orderList = [
      // {
      //   order_number: 332245,
      //   order_date: new Date(),
      //   seller_name: 'Utily Green Private Limited',
      //   product_name: 'Concrete M-Sand-Bag',
      //   grade: 'Veri Fine',
      //   silt: '12',
      //   source_of_sand: 'Granite stone',
      //   fm: '2.3 to 3.2',
      //   lot_size: '250',
      //   order_value: '10000',
      //   price_per_ton: '1700',
      //   is_exwork: 1,
      //   delivery_address: 'khadi par, rasoolabad, bhiwandi, maharashtra',
      //   payment_term: '90',
      //   delivery_term: '60',
      //   status: 'Awaiting confirmation'
      // }
    ];
  }

  getOrderList(status: any = ''){
    this._userService.getUserOrders(`?paginate=true&per_page_records=25&order_status=${status}`)
        .subscribe((success:any) => {
          let {data, current_page, total} = success.result;

          this.orderList = data;

          this.orderList.map(order => {
            order.address = '';
            if(order.delivery_option == 1){
              let shipping_address = order.shipping_address;
              order.address = shipping_address.line_1 + ' ' + shipping_address.line_2 + ' , Landmark: ' + shipping_address.landmark + ' ' + shipping_address.city.city_name + ', ' + shipping_address.state.state_name;
            }
            if(order.delivery_option == 2){

              if(order.seller) {
                let seller_address = order.seller.address;
                order.address =  seller_address.line_1 + ' ' + seller_address.line_2 + ' , Landmark: ' + seller_address.landmark + ' ' + seller_address.city.city_name + ', ' + seller_address.state.state_name;
              } else {
                order.address = null;
              }
            }

          })
          this.currentPage = current_page;
          this.total = total;
        },(error:any) => {

        });
  }

  onStatusChange(e: any) {
    // console.log(e);
    this.getOrderList(e.value);
  }

  getOrderStatusList(){
    this._userService.getUserOrderMasterStatusList()
        .subscribe((success:any) => {
          this.orderStatusList = success.result;
        },(error:any) => {
          console.log(error);
          this.orderStatusList = [];
        });
  }

}
