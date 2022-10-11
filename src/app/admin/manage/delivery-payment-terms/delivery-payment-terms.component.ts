import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-delivery-payment-terms',
  templateUrl: './delivery-payment-terms.component.html',
  styleUrls: ['./delivery-payment-terms.component.css']
})
export class DeliveryPaymentTermsComponent implements OnInit {
  
  currentDate = new Date();
  termForm: any;
  termList: any[] = [];
  deleteId:number = 0;
  termTypes = [
    { type: 'delivery', name: 'Delivery Term' },
    { type: 'payment', name: 'Payment Term' }
  ];
  isListLoading = false;
  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              private listingService: ListingService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.initForm();
    this.listTerms();
  }

  initForm() {
    this.termForm = this.fb.group({
      id: [''],
      type: ['', Validators.required],
      type_days: ['', Validators.required]
    });
  }

  listTerms() {
    this.isListLoading = true;
    this.listingService.getPaymentDeliveryTermDays().subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.termList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.termList = [];
      }
    );
  }

  createTerm() {
    if(this.termForm.invalid) {
      this.termForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    fd.append('type', this.termForm.value.type);
    fd.append('type_days', this.termForm.value.type_days);
    this.adminService.createPaymentDeliveryTermDays(fd).subscribe(
      (success) => {
        console.log(success);
        if(success.success){
          this.showSuccess(success.error.message);
          document.getElementById('modal-close-btn')?.click();
          this.initForm();
          this.listTerms();
        }else{          
          this.showDanger(success.error.message);
        }
      },
      (error) => {
        this.showDanger(error.message);
      }
    );
  }

  delete(){
    this.adminService.deleteTermsDays(this.deleteId).subscribe(
      (success) => {
        console.log(success);
        $("#confirmModel").modal('hide');
        this.listTerms();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteTerm(id: any) {
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
