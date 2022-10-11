import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-pincodes',
  templateUrl: './pincodes.component.html',
  styleUrls: ['./pincodes.component.css']
})
export class PincodesComponent implements OnInit {


  currentDate = new Date();
  pincodeForm: any;
  pincodeList: any[] = [];
  cityList: any[] = [];
  locationList: any[] = [];
  isListLoading = false;
  deleteId:number = 0;
  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              private _listingService : ListingService, 
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.initForm();
    this.listPincode();
    this.loadCityList();
    this.loadLocationList();
  }

  initForm() {
    this.pincodeForm = this.fb.group({
      id: [''],
      city_id: ['', Validators.required],
      location_id: ['', Validators.required],
      pincode: ['', Validators.required],
      location_pincode_id:[0]
    });
  }

  loadCityList(){
    this._listingService.getCityListing()
        .subscribe(success =>{
          this.cityList = success.result;
        },error=>{
          console.log(error);
        })
  }

  loadLocationList(){
    this.adminService.getLocationList()
        .subscribe(success =>{
          this.locationList = success.result;
        },error=>{
          console.log(error);
        })
  }

  listPincode() {
    this.isListLoading = true;
    this.adminService.getAllPincodeList().subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.pincodeList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.pincodeList = [];
      }
    );
  }

  createPincode() {
    if(this.pincodeForm.invalid) {
      this.pincodeForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    fd.append('id', this.pincodeForm.value.id);
    fd.append('city_id', this.pincodeForm.value.city_id);
    fd.append('location_id', this.pincodeForm.value.location_id);
    fd.append('pincode', this.pincodeForm.value.pincode);
    fd.append('location_pincode_id', this.pincodeForm.value.location_pincode_id);
    if(this.pincodeForm.value.id) {
      this.adminService.updatePincode(fd).subscribe(
        (success) => {
          console.log(success);
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listPincode();
          }else{
            this.showDanger(success.error.message);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.adminService.createPincode(fd).subscribe(
        (success) => {
          console.log(success);
          if(success.success){            
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listPincode();
          }else{
            this.showDanger(success.error.message);
          }
        },
        (error) => {
          console.log(error);
          this.showDanger(error.message);
        }
      );
    }
  }

  onEditBtn(id: any) {
    let f = this.pincodeList.find(x => x.id == id);
    this.pincodeForm.controls['id'].setValue(id);
    this.pincodeForm.controls['city_id'].setValue(f.city_id);
    this.pincodeForm.controls['location_id'].setValue(f.location_id);
    this.pincodeForm.controls['pincode'].setValue(f.pincode);
    this.pincodeForm.controls['location_pincode_id'].setValue(f.location_pincode_id);
  }

  delete(){
    this.adminService.deletePincode(this.deleteId).subscribe(
      (success) => {
        $("#confirmModel").modal('hide');
        console.log(success);
        this.listPincode();
        this.deleteId = 0;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deletePincode(id: any) {
    this.deleteId = id;
    $("#confirmModel").modal('show');
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
