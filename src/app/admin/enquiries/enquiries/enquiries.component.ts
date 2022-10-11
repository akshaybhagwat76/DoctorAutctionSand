import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ENQUIRY_STATUS, ENQUIRY_STATUS_ENUM } from 'src/app/shared/constants';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AdminService } from '../../../shared/services/admin.service';
declare let $: any;

@Component({
  selector: 'app-enquiries',
  templateUrl: './enquiries.component.html',
  styleUrls: ['./enquiries.component.css']
})
export class EnquiriesComponent implements OnInit {

  eStatus:any[] = [
    {name: 'Enquiry Recieved', value: ENQUIRY_STATUS.RECEIVED},
    {name: 'Meeting Done', value: ENQUIRY_STATUS.MEETING_DONE},
    {name: 'Enquiry Cancelled', value: ENQUIRY_STATUS.CANCELLED},
    {name: 'Enquiry Converted Into Order', value: ENQUIRY_STATUS.CONVERTED_TO_ORDER},
  ];
  enquiryNotesForm: any;
  enquiries: any[] = [];
  enquiryNotes: any[] = [];
  isListLoading: boolean = false;
  dateFilter: string = 'all';
  public enquiryStatusEnum = ENQUIRY_STATUS_ENUM;
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getEnquiries();
  }

  initForm() {
    this.enquiryNotesForm = this.fb.group({
      enquiry_id: ['', Validators.required],
      meeting_location: ['', Validators.required],
      kdm: ['', Validators.required],
      industry_sector: ['', Validators.required],
      meeting_person: ['', Validators.required],
      meeting_date: ['', Validators.required],
      previous_status: [null, Validators.required],
      status: [null, Validators.required],
      action_required: ['']
    });
  }

  handleFilterClick(dateFilter: string) {
    this.dateFilter = dateFilter;
    this.getEnquiries();
  }

  getEnquiries() {
    this.isListLoading = true;
    this.adminService.getEnquiries('?date_filter=' + this.dateFilter).subscribe((res: any) => {
      console.log(res);
      this.isListLoading = false;
      if(res.success) {
        this.enquiries = res.result;
      } else {
        this.enquiries = [];
      }
    }, (error: any) => {
      this.isListLoading = false;
      console.log(error);
      this.enquiries = [];
    });
  }

  getEnquiryNotes(eId: any) {
    this.isListLoading = true;
    this.adminService.getEnquiryNotes('?enquiry_id=' + eId).subscribe((res: any) => {
      console.log(res);
      this.isListLoading = false;
      if(res.success) {
        this.enquiryNotes = res.result;
      } else {
        this.enquiryNotes = [];
      }
    }, (error: any) => {
      this.isListLoading = false;
      console.log(error);
      this.enquiryNotes = [];
    });
  }

  onAddNotes(eId: any) {
    this.getEnquiryNotes(eId);
    this.enquiryNotesForm.controls.enquiry_id.setValue(eId);
    $('#addNotesModal').modal('show');
  }

  onSubmitEnquiryNote() {
    if(!this.enquiryNotesForm.valid) {
      this.enquiryNotesForm.markAllAsTouched();
      return;
    }
    this.adminService.addEnquiryNotes(this.enquiryNotesForm.value).subscribe((res: any) => {
      console.log(res);
      if(res.success) {
        this.getEnquiryNotes(this.enquiryNotesForm.value.enquiry_id);
        this.showSuccess(res.error.message);
        this.enquiryNotesForm.reset();
      } else {
        this.showDanger(res.error.message);
      }
    }, (error: any) => {
      console.log(error);
      this.showDanger('Something went wrong');
    });
  }

  showSuccess(message: any) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message: any) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 7000 });
  }

}
