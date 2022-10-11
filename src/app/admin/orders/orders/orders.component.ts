import { Component, OnInit } from '@angular/core';
import { BUYER_ACCEPTED, ORDER_PLACED, SELLER_CONFIRMED } from 'src/app/shared/constants';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';
declare let $: any;
@Component({
  selector: 'app-admin-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  isListLoading: boolean = false;
  orderList: any[] = [];
  currentPage: any;
  total: any;
  orderStatusList: any[] = [];
  isModalAddProductOpen: boolean = false;

  orderPlacedStatus = ORDER_PLACED;
  sellerList: any[] = [];
  selectedSeller: any;
  selectedOrder: any;
  sellerConfirmed = SELLER_CONFIRMED;
  orderAccepted = BUYER_ACCEPTED;
  constructor(private _userService: UserService,
    private _adminService: AdminService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getOrderStatusList();
    this.getOrderList();
    this.orderList = [
    ];
  }
  handleModalOpenClick(e: any = null) {
    this.isModalAddProductOpen = true;
  }
  handleModalClose(e: any) {
    if (e && e.refresh) {
      // this.listComponent.fetchListItems();
    }
    this.isModalAddProductOpen = false;
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

  getSellerList(order: any) {
    // console.log(e);
    // let product = e.buyer_order_items.sale_products;
    let productIds = '';
    let gradeIds = '';
    order.buyer_order_items.forEach((e: any, i: any) => {
      productIds += e.sale_products.product_id;
      gradeIds += e.sale_products.grade_id;
      if(i+1 !== order.buyer_order_items.length) {
        productIds += ',';
        gradeIds += ',';
      }
    });
    this.selectedOrder = order;
    this._adminService.getFixedPriceSellerList({product_id: productIds, grade_id: gradeIds})
      .subscribe((success:any) => {
        // this.sellerList = success.result;
        // console.log(this.sellerList);
        if(success.result && success.result.length > 0) {
          success.result.forEach((e: any) => {
            e.products = [];
            let exist = this.sellerList.find(x => x.id === e.id);
            if(exist) {
              
              let pExist = exist.products.find((x:any) => x.product_id === e.product_id && x.grade_id === e.grade_id);
              if(!pExist) {
                exist.products.push({
                  product_name: e.product_name,
                  tonnage: e.tonnage,
                  total: e.total,
                  product_id: e.product_id,
                  grade_id: e.grade_id
                });
              }
            } else {
              e.products.push({
                product_name: e.product_name,
                tonnage: e.tonnage,
                total: e.total,
                product_id: e.product_id,
                grade_id: e.grade_id
              });
              this.sellerList.push(e);
            }
          });
          console.log(this.sellerList)
        }
      },(error:any) => {
        console.log(error);
        this.sellerList = [];
    });
  }

  notifySeller() {
    if(!this.selectedSeller) {
      this.showDanger('Please select seller.');
      return;
    }
    this._adminService.notifySellerAboutOrder({order_id: this.selectedOrder.id, seller_id: this.selectedSeller.id})
      .subscribe((success:any) => {
        if(success.success) {
          this.showSuccess(success.error.message);
          $('#sellerModal').modal('hide');
          this.getOrderList();
          this.selectedOrder = null;
          this.selectedSeller = null;
        } else {
          this.showDanger(success.error.message);
        }
      },(error:any) => {
        // this.selectedOrder = null;
        // this.selectedSeller = null;
        console.log(error);
        this.showDanger('Something went wrong.');
    });
  }

  onSellerRadioChange(e: any) {
    this.selectedSeller = e;
    // console.log(e);
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
