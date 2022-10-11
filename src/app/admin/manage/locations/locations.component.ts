import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  
  currentDate = new Date();
  locationForm: any;
  locationList: any[] = [];
  isListLoading = false;
  deleteId:number= 0;
  constructor(private adminService: AdminService,
              private fb: FormBuilder, private toastService: ToastService) { }

  ngOnInit(): void {
    this.initForm();
    this.listLocation();
  }

  initForm() {
    this.locationForm = this.fb.group({
      id: [''],
      location_name: ['', Validators.required]
    });
  }

  listLocation() {
    this.isListLoading = true;
    this.adminService.getLocationList().subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.locationList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.locationList = [];
      }
    );
  }

  createLocation() {
    if(this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    fd.append('id', this.locationForm.value.id);
    fd.append('location_name', this.locationForm.value.location_name);
    if(this.locationForm.value.id) {
      this.adminService.updateLocation(fd).subscribe(
        (success) => {
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listLocation();
          }else{
            this.showDanger(success.error.message);
          }
        },
        (error) => {
          console.log(error);
          this.showDanger(error.message);
        }
      );
    } else {
      this.adminService.createLocation(fd).subscribe(
        (success) => {
          console.log(success);
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listLocation();
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
    let f = this.locationList.find(x => x.id == id);
    this.locationForm.controls['id'].setValue(id);
    this.locationForm.controls['location_name'].setValue(f.location_name);
  }

  delete(){
    this.adminService.deleteLocation(this.deleteId).subscribe(
      (success) => {
        $("#confirmModel").modal('hide');
        console.log(success);
        this.listLocation();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  deleteLocation(id: any) {
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
