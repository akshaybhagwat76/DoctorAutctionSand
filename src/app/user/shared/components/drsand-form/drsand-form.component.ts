import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-drsand-form',
  templateUrl: './drsand-form.component.html',
  styleUrls: ['./drsand-form.component.css']
})
export class DrsandFormComponent implements OnInit {
  @Output() formValue: any = new EventEmitter();
  @Input() formData: any;
  drSandForm: any;
  orderItems: any[] = [];
  deliveryAddressList: any[] = [];
  pickupAddressList: any[] = [];
  buyerId: any;
  sellerId: any;
  pDetails: any;
  constructor(
    private fb: FormBuilder,
    private _userService: UserService
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.onFormValueChange();
  }

  initForm() {
    let data: any = {};
    this.formData.forEach((element: any) => {
      if(element.fieldType === 'select') {
        this.orderItems = element.value;
        data['delivery_address_id'] = [''];
        data['pickup_address_id'] = [''];
        data['tonnage'] = [''];
        data['product_details'] = new FormArray([]);
        this.buyerId = element.buyer_id;
        this.sellerId = element.seller_id;
        // console.log(this.sellerId);
        // console.log(this.buyerId);
        data[element.formControlName] = [element.value[0].order_item_id];
      } else {
        data[element.formControlName] = element.value ? [element.value] : [''];
      }
    });
    this.drSandForm= this.fb.group(data);
    let orderItemIds: any = [];
    let totalTonnage = 0;
    if(this.orderItems && this.orderItems.length > 0) {
      this.pDetails = this.drSandForm.get('product_details') as FormArray;
      this.orderItems.forEach((element:any) => {
        let formArrayData = this.fb.group({
          id: element.order_item_id,
          name: element.name,
          tonnage: element.qty
        });
        totalTonnage += element.qty
        this.pDetails.push(formArrayData);
        orderItemIds.push(element.order_item_id);
      });
      this.drSandForm.controls.order_item_id.setValue(orderItemIds);
      this.drSandForm.controls.tonnage.setValue(totalTonnage);
      this.getDeliveryAddressList();
      this.getPickupAddressList();
      // this.onProductChange();
    }
  }

  onProductChange(e: any) {
    // const a = this.orderItems.find((x: any) => x.order_item_id === this.drSandForm.value.order_item_id);
    // this.drSandForm.controls.tonnage.setValue(a.qty);
    // const a = this.orderItems.filter((x: any) => x.order_item_id === this.drSandForm.value.order_item_id);
    // this.drSandForm.controls.tonnage.setValue(a.qty);
    // console.log(e);
    let totalTonnage = 0;
    this.pDetails = new FormArray([]);
    if(e && e.length > 0) {
      e.forEach((element:any) => {
        let formArrayData = this.fb.group({
          id: element.order_item_id,
          name: element.name,
          tonnage: element.qty
        });
        totalTonnage += element.qty
        this.pDetails.push(formArrayData);
      });
    }
    this.drSandForm.controls.tonnage.setValue(totalTonnage);
  }

  onTonnageChange() {
    let tonnage = 0;
    this.pDetails.controls.forEach((element:any) => {
      tonnage += +element.value.tonnage;
    });
    this.drSandForm.controls.tonnage.setValue(tonnage);
  }

  getDeliveryAddressList(){
    this.deliveryAddressList = [];
    this._userService.getUserAddressList('?user_id2=' + this.buyerId)
        .subscribe(success=>{
          if(success.success) {
            let a: any[] = [];
            success.result.forEach((element: any) => {
              const landmark = (element.landmark ? element.landmark + ',' : '')
                              + (element.city_name ? element.city_name + ',' : '')
                              + (element.pincode ? element.pincode : '');
              a.push({id: element.id, landmark: landmark});
            });
            this.deliveryAddressList = a;
          }
        },  error=>{
          this.deliveryAddressList = [];
    });
  }
  getPickupAddressList(){
    this.pickupAddressList = [];
    this._userService.getUserAddressList('?user_id2=' + this.sellerId)
        .subscribe(success=>{
          if(success.success) {
            let a: any[] = [];
            success.result.forEach((element: any) => {
              const landmark = (element.landmark ? element.landmark + ',' : '')
                              + (element.city_name ? element.city_name + ',' : '')
                              + (element.pincode ? element.pincode : '');
              a.push({id: element.id, landmark: landmark});
            });
            this.pickupAddressList = a;
          }
        },  error=>{
          this.pickupAddressList = [];
    });
  }

  onFormValueChange() {
    this.drSandForm.valueChanges.subscribe((val: any) => {
      this.formValue.next(this.drSandForm.value);
      // console.log(val);
    });
  }

  fileBrowseHandler(event:any, fcName: any){
    const file = event.target.files[0];
    // this.drSandForm.controls[fcName] = file;
    this.drSandForm.controls[fcName].setValue(file);
    // this.poc_profiles.push(file);
    // console.log(this.form.controls[i].controls['poc_profile'].value);
  }


}
