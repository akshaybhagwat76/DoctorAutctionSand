import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UrlService } from 'src/app/shared/services/url.service';
declare let $: any;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  currentDate = new Date();
  isListLoading = false;
  gradeList: any[] = [];
  productList: any[] = [];
  productForm: any;
  deleteId:number = 0;
  productImg:boolean = false;
  ProductTypeList:any[] = [];
  product_image:any;
  constructor(private listingService: ListingService,
              private adminService: AdminService,
              private fb: FormBuilder,
              public urlService: UrlService) { }

  ngOnInit(): void {
    this.initForm();
    this.listGrades();
    this.listProducts();
    this.listProductTypes();
  }

  initForm(isnew:any = true) {
    this.productForm = this.fb.group({
      id: [''],
      product_type : ['',Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      img: ['', isnew ? Validators.required :''],
      grade_id: ['', Validators.required],
      tax: ['', [Validators.required,Validators.pattern('[0-9]*')]],
      hsn: ['', Validators.required]
    });
  }

  listGrades() {
    this.listingService.getGradeList().subscribe(
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

  listProducts() {
    this.isListLoading = true;
    this.listingService.getAuProductList().subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        const products = success.result;
        this.productList = [];
        if(products && products.length > 0){
          products.forEach((item:any)=> {
            var existing = this.productList.filter(function(v, i) {
              return v.id == item.id;
            });
            if (existing.length) {
              var existingIndex = this.productList.indexOf(existing[0]);
              this.productList[existingIndex].grade_id = this.productList[existingIndex].grade_id.concat(item.grade_id);
            } else {
              if (typeof item.grade_id == 'number')
                item.grade_id = [item.grade_id];
              this.productList.push(item);
            }
          });
        }
        console.log(this.productList);
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.productList = [];
      }
    );
  }

  fileBrowseHandler(event:any){
    const file = event.target.files[0];
    this.productForm.controls['img'].setValue(file);
  }

  createProduct() {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    let fd = new FormData();
    fd.append('id', this.productForm.value.id);
    fd.append('product_type',this.productForm.value.product_type);
    fd.append('name', this.productForm.value.name);
    fd.append('description', this.productForm.value.description);
    fd.append('tax', this.productForm.value.tax);
    fd.append('hsn', this.productForm.value.hsn);
    const grades = this.productForm.value.grade_id;
    grades.forEach((element:any) => {
      fd.append('grade_id[]', element);  
    });
    console.log(this.productForm);
    console.log(this.productForm.value.grade_id);
    // return;
    if(this.productForm.value.id) {
      if(this.productForm.value.img)
      fd.append('img', this.productForm.value.img);
      this.adminService.updateProduct(fd).subscribe(
        (success) => {
          console.log(success);
          document.getElementById('modal-close-btn')?.click();
          this.initForm();
          this.listProducts();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      fd.append('img', this.productForm.value.img);
      this.adminService.createProduct(fd).subscribe(
        (success) => {
          console.log(success);
          document.getElementById('modal-close-btn')?.click();
          this.initForm();
          this.listProducts();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  delete(){
    this.adminService.deleteProduct(this.deleteId).subscribe(
      (success) => {
        $("#confirmModel").modal('hide');
        console.log(success);
        this.listProducts();
        this.deleteId = 0;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteProduct(id: any) {
    this.deleteId = id;
    $("#confirmModel").modal('show');
  }

  onEditBtn(id: any) {
    // this.listGrades();
    this.initForm(false);
    let f = this.productList.find(x => x.id == id);
    this.productForm.controls['id'].setValue(id);
    this.productForm.controls['product_type'].setValue(f.product_type);
    this.productForm.controls['description'].setValue(f.description);
    this.productForm.controls['name'].setValue(f.name);
    this.productForm.controls['grade_id'].setValue(f.grade_id);
    this.productForm.controls['tax'].setValue(f.tax);
    this.productForm.controls['hsn'].setValue(f.hsn);
    // this.productForm.controls['img'].setValue(f.image);
    this.productImg = true;
    this.product_image = f.image;
  }

  newProduct(){
    this.productImg = false;
    this.initForm();
  }


  listProductTypes(){
    this.listingService.getProductTypeList()
        .subscribe((res:any) =>{
          this.ProductTypeList = res.result;
        },(err:any)=>{
          console.log(err);
        })
  }
}
