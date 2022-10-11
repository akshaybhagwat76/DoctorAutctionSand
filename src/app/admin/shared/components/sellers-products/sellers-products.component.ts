import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UrlService } from 'src/app/shared/services/url.service';

declare let $: any;
@Component({
  selector: 'app-sellers-products',
  templateUrl: './sellers-products.component.html',
  styleUrls: ['./sellers-products.component.css']
})
export class SellersProductsComponent implements OnInit {

  @Input() sellerDetails: any;
  @Output() backToList = new EventEmitter<any>();
  isListLoading: boolean = false;
  gradeList: any[] = [];
  productList: any[] = [];
  inventoryList: any[] = [];
  productForm: any;
  dateList: any[] = [
    {name: 'JAN', value: 1},
    {name: 'FEB', value: 2},
    {name: 'MARCH', value: 3},
    {name: 'APRIL', value: 4},
    {name: 'MAY', value: 5},
    {name: 'JUNE', value: 6},
    {name: 'JULY', value: 7},
    {name: 'AUG', value: 8},
    {name: 'SEP', value: 9},
    {name: 'AUC', value: 10},
    {name: 'NOV', value: 11},
    {name: 'DEC', value: 12}
  ];
  selectedDate = new Date().getFullYear()+'-' + (new Date().getMonth()+1) + '-01';;
  month: any[] = [
    {name: 'JAN', value: '01'},
    {name: 'FEB', value: '02'},
    {name: 'MARCH', value: '03'},
    {name: 'APRIL', value: '04'},
    {name: 'MAY', value: '05'},
    {name: 'JUNE', value: '06'},
    {name: 'JULY', value: '07'},
    {name: 'AUG', value: '08'},
    {name: 'SEP', value: '09'},
    {name: 'AUC', value: '10'},
    {name: 'NOV', value: '11'},
    {name: 'DEC', value: '12'}
  ]
  editDate = new FormControl('01');
  udLoading: boolean = false;

  inventoryDetails: any = {};
  analysisReport:boolean = false;
  analysis_report_url:any;
  concertReport:boolean = false;
  concert_report_url:any;
  otherReport:boolean = false;
  other_report_url:any;
  constructor(private listingService: ListingService,
              private adminService: AdminService,
              private fb: FormBuilder,
              public urlService: UrlService) { }

  ngOnInit(): void {
    this.initForm();
    console.log(this.sellerDetails);
    this.listProducts();
    this.listInventory();
  }

  initForm() {
    this.productForm = this.fb.group({
      id: [''],
      seller_id: ['', Validators.required],
      auction_product_id: ['', Validators.required],
      grade_id: ['', Validators.required],
      date: [new Date().getFullYear() + '-01' + '-01', Validators.required],
      tonnage: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]],
      price_per_ton: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]],
      analysis_report: [''],
      concert_test_report: [''],
      other_report: [''],
    });
    this.productForm.controls['seller_id'].setValue(this.sellerDetails.userId);
    // this.editDate.setValue('1');
    this.editDate = new FormControl('01');
    // let a: any = document.getElementById('a_report');
    // a.value = '';
    // let b: any = document.getElementById('b_report');
    // b.value = '';
    // let c: any = document.getElementById('c_report');
    // c.value = '';
    $('#a_report').val('');
    $('#b_report').val('');
    $('#c_report').val('');
  }

  // handle back to list
  back2List(refresh: boolean = false) {
    this.backToList.emit({ refresh });
  }

  listInventory() {
    this.isListLoading = true;
    this.adminService.getInventoryList({seller_id: this.sellerDetails.userId, date: this.selectedDate}).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.inventoryList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.inventoryList = [];
      }
    );
  }

  getInventoryDetails(id: any) {
    this.adminService.getInventoryDetails({id: id}).subscribe(
      (success) => {
        console.log(success);
        this.inventoryDetails = success.result;
        this.listGrades(this.inventoryDetails.auction_product_id);
        this.parseFormData(this.inventoryDetails);
      },
      (error) => {
        console.log(error);
        this.inventoryDetails = {};
      }
    );
  }

  parseFormData(data: any) {
    this.productForm = this.fb.group({
      id: [data.id],
      seller_id: [data.seller_id, Validators.required],
      auction_product_id: [data.auction_product_id, Validators.required],
      grade_id: [data.grade_id, Validators.required],
      date: [data.date, Validators.required],
      tonnage: [data.tonnage, [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]],
      price_per_ton: [data.price_per_ton, [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]],
      analysis_report: [''],
      concert_test_report: [''],
      other_report: ['']
    });
    this.editDate.setValue(data.date.split("-")[1]);
    this.analysisReport = true;
    this.analysis_report_url = data.analysis_report;
    if(data.concert_report) {
      this.concertReport = true;
      this.concert_report_url = data.concert_report;
    } else {
      this.concertReport = false;
      this.concert_report_url = '';
    }
    if(data.other_report) {
      this.otherReport = true;
      this.other_report_url = data.other_report;
    } else {
      this.otherReport = false;
      this.other_report_url = '';
    }
  }

  onDateChange(e: any) {
    this.selectedDate = new Date().getFullYear()+'-' + e.value + '-01';
    this.listInventory();
  }

  listProducts() {
    this.isListLoading = true;
    this.listingService.getSandTypeList().subscribe(
      (success) => {
        console.log(success);
        this.productList = success.result;
      },
      (error) => {
        console.log(error);
        this.productList = [];
      }
    );
  }

  onProductChange(e: any) {
    console.log(e);
    this.listGrades(e.id);
    this.productForm.controls['grade_id'].setValue('');
  }

  listGrades(id: any) {
    this.listingService.getProductGradeList(id).subscribe(
      (success) => {
        console.log(success);
        this.gradeList = success.result;
      },
      (error) => {
        console.log(error);
        this.gradeList = [];
      }
    );
  }

  fileBrowseAnalysisReportHandler(event:any){
    const file = event.target.files[0];
    this.productForm.controls["analysis_report"].size = file.size/1024;
    this.productForm.controls.analysis_report.touched = true;
    if(file && file.size/1024 > 1024) {
      event.target.value = null;
      return;
    }
    this.productForm.controls['analysis_report'].setValue(file);
  }

  fileBrowseConcertReportHandler(event:any){
    const file = event.target.files[0];
    this.productForm.controls['concert_test_report'].setValue(file);
  }

  fileBrowseOtherReportHandler(event:any){
    const file = event.target.files[0];
    this.productForm.controls['other_report'].setValue(file);
    console.log(this.productForm.controls['other_report'].value);
  }

  onMonthChange(e: any) {
    if(e && e.value) {
      this.productForm.controls['date'].setValue(new Date().getFullYear()+'-' + e.value + '-01');
    } else {
      this.productForm.controls['date'].setValue('');
    }
  }

  createProduct() {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    fd.append('id', this.productForm.value.id);
    fd.append('seller_id', this.productForm.value.seller_id);
    fd.append('auction_product_id', this.productForm.value.auction_product_id);
    fd.append('date', this.productForm.value.date);
    fd.append('grade_id', this.productForm.value.grade_id);
    fd.append('tonnage', this.productForm.value.tonnage);
    fd.append('price_per_ton', this.productForm.value.price_per_ton);
    fd.append('analysis_report', this.productForm.value.analysis_report);
    fd.append('concert_test_report', this.productForm.value.concert_test_report);
    fd.append('other_report', this.productForm.value.other_report);
    // console.log(this.productForm.value);
    // return;
    if(this.productForm.value.id) {
      this.adminService.updateInventory(fd).subscribe(
        (success) => {
          console.log(success);
          document.getElementById('modal-close-btn')?.click();
          this.initForm();
          this.listInventory();
          $('input[type="file"]').val('');
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      if(!this.productForm.controls['analysis_report'].value) {
        this.productForm.controls['analysis_report'].touched = true;
        return;
      }
      this.adminService.createInventory(fd).subscribe(
        (success) => {
          console.log(success);
          document.getElementById('modal-close-btn')?.click();
          this.initForm();
          this.listInventory();
          // $('input[type="file"]').val('');
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  newProductInventory(){
    this.analysisReport = false;
    this.analysis_report_url = '';
    this.concertReport = false;
    this.concert_report_url = '';
    this.otherReport = false;
    this.other_report_url = '';
    this.initForm();
  }

}
