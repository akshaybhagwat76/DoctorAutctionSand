import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-serviceable-pincodes',
  templateUrl: './serviceable-pincodes.component.html',
  styleUrls: ['./serviceable-pincodes.component.css']
})
export class ServiceablePincodesComponent implements OnInit {
  @Input() sellerId: any;
  @Output() backToList = new EventEmitter<any>();
  isListLoading: boolean = false;
  pinList: any[] = [];
  allPinList: any[] = [];
  pincodeForm: any;
  udLoading: boolean = false;
  constructor(private adminService: AdminService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.listPincodes();
    this.pincodeForm.controls['seller_id'].setValue(this.sellerId);
    this.listAllPincodes();
  }

  initForm() {
    this.pincodeForm = this.fb.group({
      id: [''],
      seller_id: [this.sellerId, Validators.required],
      pincode_id: ['', Validators.required],
      logistic_price: ['', Validators.required]
    });
  }

  // handle back to list
  back2List(refresh: boolean = false) {
    this.backToList.emit({ refresh });
  }

  listPincodes() {
    this.isListLoading = true;
    this.adminService.getSellerPincodeList(this.sellerId).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.pinList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.pinList = [];
      }
    );
  }

  listAllPincodes() {
    this.adminService.getAllPincodeList().subscribe(
      (success) => {
        console.log(success);
        this.allPinList = success.result;
      },
      (error) => {
        console.log(error);
        this.allPinList = [];
      }
    );
  }

  createSellerPincode() {
    if(this.pincodeForm.invalid) {
      this.pincodeForm.markAllAsTouched();
      return;
    }
    if(this.pincodeForm.value.id) {
      this.adminService.updateSellerPincode(this.pincodeForm.value).subscribe(
        (success) => {
          console.log(success);
          this.initForm();
          this.listPincodes();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.adminService.createSellerPincode(this.pincodeForm.value).subscribe(
        (success) => {
          console.log(success);
          this.initForm();
          this.listPincodes();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onEdit(id: any) {
    let pincode = this.pinList.find(x => x.id == id);
    this.pincodeForm.controls['id'].setValue(id);
    this.pincodeForm.controls['pincode_id'].setValue(pincode.pincode_id);
    this.pincodeForm.controls['logistic_price'].setValue(pincode.logistic_price);
  }



}
