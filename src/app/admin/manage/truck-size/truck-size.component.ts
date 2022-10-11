import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-truck-size',
  templateUrl: './truck-size.component.html',
  styleUrls: ['./truck-size.component.css']
})
export class TruckSizeComponent implements OnInit {

  currentDate = new Date();
  isListLoading = false;
  truckSizeList: any[] = [];
  truckSizeForm: any;
  deleteId:number = 0;
  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              private listingService: ListingService, 
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.initForm();
    this.listTruckSize();
  }

  initForm() {
    this.truckSizeForm = this.fb.group({
      id: [''],
      lot_size: ['', Validators.required],
      // lot_unit: ['', Validators.required]
    });
  }

  listTruckSize() {
    this.isListLoading = true;
    this.listingService.getTruckSizeList().subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.truckSizeList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.truckSizeList = [];
      }
    );
  }

  createTruckSize() {
    if(this.truckSizeForm.invalid) {
      this.truckSizeForm.markAllAsTouched();
      return;
    }
    if(this.truckSizeForm.value.id) {
      this.adminService.updateTruckSize(this.truckSizeForm.value).subscribe(
        (success) => {
          console.log(success);
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listTruckSize();
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
      this.adminService.createTruckSize(this.truckSizeForm.value).subscribe(
        (success) => {
          console.log(success);
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listTruckSize();
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

  delete(){
    this.adminService.deleteTruckSize(this.deleteId).subscribe(
      (success) => {
        $("#confirmModel").modal('hide');
        console.log(success);
        this.listTruckSize();
        this.deleteId = 0;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteTruckSize(id: any) {
    this.deleteId = id;
    $("#confirmModel").modal('show');
  }

  onEditBtn(id: any) {
    let f = this.truckSizeList.find(x => x.id == id);
    this.truckSizeForm.controls['id'].setValue(id);
    this.truckSizeForm.controls['lot_size'].setValue(f.lot_size);
    // this.truckSizeForm.controls['lot_unit'].setValue(f.lot_unit);
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
