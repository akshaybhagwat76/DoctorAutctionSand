import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WindowRefService } from 'src/app/shared/services/window-ref.service';
declare let $: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartData: any = {};
  productDetailList: any[] = [];
  modalRemoveData: any = {};
  constructor(private _userService: UserService,
    private winRef: WindowRefService,
    public toastService: ToastService,
    private _router: Router) { }

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(status: any = ''){
    this.productDetailList = [];
    this._userService.getCartData('')
        .subscribe((success:any) => {
          // console.log(success.result);
          this.cartData = success.result;

          if(success.success) {
            if(this.cartData && this.cartData.cart_items && this.cartData.cart_items.length > 0) {
              this.cartData.cart_items.forEach((e: any) => {
                let a = {
                  source_of_sand : e.sale_products.source,
                  name : e.sale_products.product.name || '',
                  description: e.sale_products.product.description,
                  gradedetails : e.sale_products.grade,
                  grade: e.sale_products.grade ? e.sale_products.grade.grade : '',
                  silt: e.sale_products.silt,
                  fineness_modulus: e.sale_products.grade ? e.sale_products.grade.fineness_modulus : '',
                  image: e.sale_products.product.image,
                  product_number: e.sale_products.product_number,
                  truck_size: e.truck_size,
                  qty: e.qty,
                  logistic_price: e.logistic_price,
                  is_cart: 1,
                  id:e.id,
                  subtotal: e.sub_total
                }
                this.productDetailList.push(a);
              });
            }
          }
        },(error:any) => {
          console.log(error);
          this.productDetailList = [];
        });
  }

  confirmPlaceOrder() {
    this._userService.placeOrder({})
      .subscribe(success=>{
        if(success.success) {
          $('#confirmOrderModal').modal('hide');
          if(this.cartData.payment_option == '2') {
            this.showSuccess(success.error.message + ' Order ID: ' + success.result);
            this._router.navigateByUrl('/user/orders');
          } else {
            this.payWithRazor(success.result);
          }
          // this.showSuccess(success.error.message);
          // this._router.navigateByUrl('/user/cart');
        } else {
          this.showDanger(success.error.message);
        }
      }, error=>{
        this.showDanger(error.message);
    });
  }

  payWithRazor(val: any) {
    console.log(val.payable_amount);
    const options: any = {
      key: val.razorpayKey,
      amount: val.payable_amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'DOCTOR SAND', // company name or product name
      description: '',  // product description
      image: '../assets/img/drsandlogo.png', // company logo or product image
      order_id: val.rpOrderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      prefill: {
        name: val.name,
        email: val.email,
        contact: val.contactNumber
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0988CE'
      }
    };
    options.handler = ((response: any, error: any) => {
      options.response = response;
      response.order_id = val.order_id;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
      this._userService.verifyPaymentSignatureBuyerOrder({ response, base_amount : val.grand_total, order_id: val.order_id }).subscribe(
        (success) => {
          if(success.success) {
            window.location.href = 'user/orders';
          } else {
            console.log(success);
            this.showDanger('Something went wrong.');
          }
        },
        (fail) => {
          console.log(fail);
        }
      );
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
    console.log("start msg");
  }

  removeItemFromCart(id: any) {
    if(id) {
      this._userService.removeFromCart({cart_item_id: id})
        .subscribe(success=>{
          if(success.success) {
            this.showSuccess(success.error.message);
            this.getCartData();
          } else {
            this.showDanger(success.error.message);
          }
        }, error=>{
          this.showDanger(error.message);
      });
    } else {
      this.showDanger('id required');
    }
  }

  onConfirmRemove(e: any) {
    if(e) {
      this.removeItemFromCart(this.modalRemoveData.data.id);
    }
  }

  onRemoveBtnClick(e: any) {
    console.log(e);
    this.modalRemoveData.data = e;
    this.modalRemoveData.text = `Are you sure you want to remove ${e.name} from cart?`;
    this.modalRemoveData.title = `<span class="text-danger">Remove ${e.name}</span>`;
    $('#modalRemoveConfirm').modal('show');
  }



  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 1000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 10000 });
  }

}
