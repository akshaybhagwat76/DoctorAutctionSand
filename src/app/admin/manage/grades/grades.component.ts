import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
declare let $: any;
@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  
  toastBody: any;
  toastTitle: any;
  toastType: any;
  currentDate = new Date();
  gradeForm: any;
  gradeList: any[] = [];
  isListLoading = false;
  deleteId:number=0;
  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              private listingService: ListingService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.initForm();
    this.listGrades();
  }

  initForm() {
    this.gradeForm = this.fb.group({
      id: [''],
      grade: ['', Validators.required],
      fineness_modulus: ['', Validators.required]
    });
  }

  listGrades() {
    this.isListLoading = true;
    this.listingService.getGradeList().subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.gradeList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.gradeList = [];
      }
    );
  }

  createGrade() {
    if(this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    fd.append('id', this.gradeForm.value.id);
    fd.append('grade', this.gradeForm.value.grade);
    fd.append('fineness_modulus', this.gradeForm.value.fineness_modulus);
    if(this.gradeForm.value.id) {
      this.adminService.updateGrade(fd).subscribe(
        (success) => {
          console.log(success);
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listGrades();
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
      this.adminService.createGrade(fd).subscribe(
        (success) => {
          console.log(success);
          if(success.success){
            this.showSuccess(success.error.message);
            document.getElementById('modal-close-btn')?.click();
            this.initForm();
            this.listGrades();
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
    let f = this.gradeList.find(x => x.id == id);
    this.gradeForm.controls['id'].setValue(id);
    this.gradeForm.controls['grade'].setValue(f.grade);
    this.gradeForm.controls['fineness_modulus'].setValue(f.fineness_modulus);
  }

  delete(){
    this.adminService.deleteGrade(this.deleteId).subscribe(
      (success) => {
        $("#confirmModel").modal('hide');
        console.log(success);
        this.listGrades();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  deleteGrade(id: any) {
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
