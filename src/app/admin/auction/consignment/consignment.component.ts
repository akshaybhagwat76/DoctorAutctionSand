import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';

declare let $: any;

@Component({
  selector: 'app-consignment',
  templateUrl: './consignment.component.html',
  styleUrls: ['./consignment.component.css']
})
export class ConsignmentComponent implements OnInit {
  auctionDetails: any;
  auctionId: any;
  isListLoading: boolean = false;
  consignmentList: any[] = [];
  consignmentForm: any;
  truckDetails: any;
  consignmentDetails: any;
  truckList: any[] = [];
  inValidTruckTonnage: boolean = false;
  selectedConsignmentId:number = 0;
  modalId = 'deleteConsignmentConfirmation';
  modalData = {
    title: '',
    text: '',
    primaryBtnText:'',
    secondaryBtnText:''
  };

  currentDate = new Date();

  showNumberOfConsignmentInput: boolean = false;
  constructor(private route: ActivatedRoute,private adminService: AdminService,
    private fb: FormBuilder, private toastService: ToastService) { }

  ngOnInit(): void {
    this.auctionId = this.route.snapshot.params.id;
    this.listConsignments();
    // this.initForm();
  }

  initForm() {
    this.consignmentForm = this.fb.group({
      id: [''],
      auction_id: [this.auctionId],
      date: ['', Validators.required],
      no_of_trucks: ['', Validators.required],
      tonnage: ['', [Validators.required, Validators.max(this.auctionDetails.lot_size)]],
      lr_number:[''],
      eway_number:[''],
      transporter:[''],
      truck_details: new FormArray([this.fb.group({
        t_vehicle_number: ['', Validators.required],
        t_tonnage: ['', Validators.required],
        t_driver_name: ['', Validators.required],
        t_driver_number: [''],
        t_make: [''],
        t_document: ['']
      })]),
    });

    this.truckDetails = this.consignmentForm.get('truck_details') as FormArray;
  }

  calcMaxTonnage() {
    let tTonnage = 0;
    this.truckDetails.controls.forEach((e: any) => {
      tTonnage += +e.value.t_tonnage;
    });
    if(tTonnage == this.consignmentForm.value.tonnage) {
      this.inValidTruckTonnage = false;
    } else {
      this.inValidTruckTonnage = true;
    }
  }

  listConsignments() {
    this.isListLoading = true;
    this.adminService.getConsignments(this.auctionId).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.consignmentList = success.result.consignments;
        this.auctionDetails = success.result.auction_details;
        if(this.auctionDetails && this.auctionDetails.no_of_consignments) {
          this.showNumberOfConsignmentInput = false;
        } else {
          this.showNumberOfConsignmentInput = true;
        }
        this.initForm();
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.consignmentList = [];
        this.auctionDetails = null;
      }
    );
  }

  getConsignmentDetails(id: any) {
    this.isListLoading = true;
    this.adminService.getConsignmentDetails(id).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.consignmentDetails = success.result.consignment_detail;
        this.truckList = success.result.consignment_trucks;
        this.parsForm();
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.consignmentDetails = null;
        this.truckList = [];
      }
    );
  }

  parsForm() {
    let trckFA: any[] = [];
    if(this.truckList && this.truckList.length > 0) {
      this.truckList.forEach(element => {
        let group = this.fb.group({
          t_vehicle_number: [element.vehicle_number ? element.vehicle_number : '', Validators.required],
          t_tonnage: [element.tonnage ? element.tonnage : '', Validators.required],
          t_driver_name: [element.driver_name ? element.driver_name : '', Validators.required],
          t_driver_number: [element.driver_number ? element.driver_number : ''],
          t_make: [element.make ? element.make : ''],
          t_document: ['']
        });
        trckFA.push(group);
      });
    }
    this.consignmentForm = this.fb.group({
      id: [this.consignmentDetails.id],
      auction_id: [this.auctionId],
      date: [this.consignmentDetails.date.split(' ')[0], Validators.required],
      no_of_trucks: [this.consignmentDetails.no_of_trucks, Validators.required],
      tonnage: [this.consignmentDetails.tonnage, Validators.required],
      truck_details: new FormArray(trckFA),
      lr_number : [this.consignmentDetails.lr_number],
      eway_number : [this.consignmentDetails.eway_number],
      transporter : [this.consignmentDetails.transporter]
    });

    this.truckDetails = this.consignmentForm.get('truck_details') as FormArray;
  }

  addTrucks() {
    let truck = this.fb.group({
      t_vehicle_number: ['', Validators.required],
      t_tonnage: ['', Validators.required],
      t_driver_name: ['', Validators.required],
      t_driver_number: [''],
      t_make: [''],
      t_document: ['']
    });
    this.truckDetails.push(truck);
  }

  removeTruck(i: number) {
    if(i != 0)
    this.truckDetails.removeAt(i);
  }

  fileBrowseHandler(event:any, i: number){
    const file = event.target.files[0];
    this.truckDetails.controls[i].controls["t_document"].setValue(file);
  }

  addConsignment() {
    console.log(this.consignmentForm.value);
    if(this.consignmentForm.invalid) {
      this.consignmentForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    // for (const key in this.consignmentForm.value) {
    //   if (Object.prototype.hasOwnProperty.call(this.consignmentForm.value, key)) {
    //     const element = this.consignmentForm.value[key];
    //     if(key == 'truck_details') {
    //       fd.append(key, JSON.stringify(element));
    //       element.forEach((e: any, i: any) => {
    //         for (const key2 in e) {
    //           if (Object.prototype.hasOwnProperty.call(e, key2)) {
    //             const element2 = e[key2];
    //             if(key2 == 'document') {
    //               fd.append('document[]', element2);
    //             } else {
    //             }
    //           }
    //         }
    //         fd.append('truck_details[]', JSON.stringify(e));
    //       });
    //     } else {
    //       fd.append(key, element);
    //     }
    //   }
    // }
    for (const key in this.consignmentForm.value) {
      if (Object.prototype.hasOwnProperty.call(this.consignmentForm.value, key)) {
        const element = this.consignmentForm.value[key];
        if(key == 'truck_details') {
          fd.append(key, JSON.stringify(element));
          element.forEach((e: any, i: any) => {
            for (const key2 in e) {
              if (Object.prototype.hasOwnProperty.call(e, key2)) {
                const element2 = e[key2];
                fd.append(key2 + '[]', element2);
              }
            }
          });
        } else {
          fd.append(key, element);
        }
      }
    }
    if(this.consignmentForm.value.id) {
      this.adminService.updateConsignment(fd).subscribe(
        (success) => {
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listConsignments();
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
      this.adminService.createConsignment(fd).subscribe(
        (success) => {
          console.log(success);
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listConsignments();
          }else{
            this.showDanger(success.error.message);
          }
        },
        (error) => {
          this.showDanger('Something went wrong.');
        }
      );
    }
  }

  onEditBtn(e: any) {

  }

  deleteConfirmation(e: number) {
    this.selectedConsignmentId = e;
    this.modalData.text = `Are you sure you want to delete this consignment?`;
    this.modalData.title = 'Deleted Confirmation';
    this.modalData.primaryBtnText = "YES";
    this.modalData.secondaryBtnText = "NO";
    $('#' + this.modalId).modal('show');
  }

  deleteConsignment(e:any)
  {
    if(e){
      this.adminService.deleteConsignment({consignment_id:this.selectedConsignmentId})
            .subscribe((success)=>{
              if(success.success){
                this.showSuccess(success.error.message);
                this.listConsignments();
              }else{
                this.showDanger(success.error.message);
              }
              $('#' + this.modalId).modal('hide');
            },
            (error)=>{
              console.log(error);
              this.showDanger('Something went wrong.');
            })
    }else{
      $('#' + this.modalId).modal('hide');
    }
  }

  // onTonnageInput() {

  // }

  updateNumberOfConsignment() {
    let no_of_consignment = $('#no_of_consignments').val();

    if(!no_of_consignment) {
      this.showDanger('Please enter number of consignment.');
      return;
    }

    this.adminService.updateNumberOfConsignment({auction_id: this.auctionDetails.id, no_of_consignment: no_of_consignment}).subscribe(
      (success) => {
        console.log(success);
        if(success.success){
          this.showSuccess(success.error.message);
          document.getElementById('modal-close-btn')?.click();
          this.initForm();
          this.listConsignments();
        }else{
          this.showDanger(success.error.message);
        }
      },
      (error) => {
        console.log(error);
        this.showDanger('Something went wrong.');
      }
    );
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
