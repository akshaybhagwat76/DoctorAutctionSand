import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService, RegisterService } from 'src/app/shared/services';
import { UrlService } from 'src/app/shared/services/url.service';
declare let $: any;
@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit {
  hideCityDrop = false;
  country_id = 1;
  cityList = [];
  stateList = [];
  form:any;
  pickup_details =[];
  pickup_group =[];
  formInvalid = true;
  poc_profiles:any = [];
  error_message = '';
  user:any = null;
  postData = false;
  userId = 0;
  dial_code = [ { code: 91, name: '+91' } ];
  constructor(private _listingService: ListingService,
              private _fb : FormBuilder,
              private _router :Router,
              public _registerService: RegisterService, public urlService: UrlService) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('doctor-sand-user');
    this.user = JSON.parse(this.user);
    this.getStateList();
    // this.loadData();
    this.initForm();
  }

  loadData() {
    this._registerService.getUserDetails()
      .subscribe(success => {
        console.log(success);
      }, error => {}
    );
  }

  initForm(){
    this.form =this._fb.array([]);
    this._registerService.getPickupData()
        .subscribe(success =>{
          if(success.success){
            let result = success.result;
            if(result.length > 0){   
            this.postData = true;           
            this.hideCityDrop = true;
            for(let pickup of result){
              this.userId = pickup.user_id;
              this.form.push(this._fb.group({
            
                address : new FormControl({value:pickup.line_1,disabled: true} ,[Validators.required]),
                landmark : new FormControl({value :pickup.landmark,disabled:true},[Validators.required]),
                state_id : new FormControl({value:pickup.state_id,disabled:true},[Validators.required]),
                city_id : new FormControl({value:pickup.city_name,disabled:true},[Validators.required]),
                pincode : new FormControl({value:pickup.pincode,disabled:true},[Validators.required]),
                display_poc_profile : new FormControl({value:pickup.poc_profile,disabled:true}),
                dial_code: [91, [Validators.required]],
                // poc_reg_date : new FormControl({value:pickup.poc_reg_date,disabled:true},[Validators.required]),
                // poc_profile: ['',Validators.required],
                poc_profile: [''],
                poc_name : new FormControl({value:pickup.poc_name,disabled:true},[Validators.required]),
                poc_email : new FormControl({value:pickup.poc_email,disabled:true}, [Validators.required]),
                poc_mobile : new FormControl({value:pickup.poc_mobile,disabled:true},[Validators.required])
            
            }));
            }
            }else{
              this.InitDefaultForm();
            }
          }else{
           this.InitDefaultForm();
          }
        },error=>{
          console.log(error);
        });
    
  }

  InitDefaultForm(){   

    this.form.push(this._fb.group({
            
      address : ['',Validators.required],
      landmark : ['',Validators.required],
      state_id : [null,Validators.required],
      city_id : [null,Validators.required],
      pincode : ['',Validators.required],
      display_poc_profile:[''],
      dial_code: [91, [Validators.required]],
      // poc_reg_date : ['',Validators.required],
      // poc_profile: ['',Validators.required],
      poc_profile: [''],
      poc_name : ['',Validators.required],
      poc_email : ['',Validators.required],
      poc_mobile : ['',Validators.required]
  
  }));
  }

  getStateList(){
    this._listingService.getStateList()
        .subscribe(success=>{
          this.stateList = success.result;
        },error =>{

        });
  }

  addPickeupPoint(){
    console.log("addPickeupPoint");
    this.form.push(
      this._fb.group({
        address : ['',Validators.required],
        landmark : ['',Validators.required],
        state_id : [null,Validators.required],
        city_id : [null,Validators.required],
        pincode : ['',Validators.required],
        display_poc_profile:[''],
        dial_code: [91, [Validators.required]],
        // poc_reg_date : ['',Validators.required],
        // poc_profile: ['',Validators.required],
        poc_profile: [''],
        poc_name : ['',Validators.required],
        poc_email : ['',Validators.required],
        poc_mobile : ['',Validators.required]
      })
    );
  }


  getCityList(id:any,i:any){
    this._listingService.getCityListing(id)
        .subscribe(success=>{
          this.cityList = success.result;
        },  error=>{

        })
  } 

  fileBrowseHandler(event:any,i:any){
    const file = event.target.files[0];
    this.form.controls[i].controls['poc_profile'] = file;
    this.poc_profiles.push(file);
    // console.log(this.form.controls[i].controls['poc_profile'].value);
  }

  removePOC(index:number){
    this.form.removeAt(index);
  }

  goToPreviousPage(i:number){
    if(i==0 && !this.postData && this.form.touched){
      $('#warning-modal').modal({
        backdrop: 'static',
        keyboard: false
      });
      $('#warning-modal').modal('show');
    }else{
      var user:any = localStorage.getItem('doctor-sand-user');
      user = JSON.parse(user);
      const token = user.token;

      this._router.navigateByUrl('/register/step-one/'+token);
    }
  }
  addPickupData(){
    console.log("addPickupData");
        if(this.postData){
      this._router.navigateByUrl('/register/step-three');
      return;
    }
    this.formInvalid = false;
    let formData = new FormData();

    for(let i=0;i<this.form.length ;i++){
      let form_group = this.form.controls[i] as FormGroup;

      if(form_group.invalid){
        this.formInvalid = true;
        break;
      }else{
        formData.append('address[]',form_group.controls['address'].value);
        formData.append('landmark[]',form_group.controls['landmark'].value);
        formData.append('city_id[]',form_group.controls['city_id'].value);
        formData.append('state_id[]',form_group.controls['state_id'].value);
        formData.append('country_id[]',"1");
        formData.append('pincode[]',form_group.controls['pincode'].value);
        // formData.append('poc_reg_date[]',form_group.controls['poc_reg_date'].value);
        formData.append('poc_profile[]',this.poc_profiles[i]?this.poc_profiles[i]:[]);
        formData.append('poc_name[]',form_group.controls['poc_name'].value);
        formData.append('poc_email[]',form_group.controls['poc_email'].value);
        formData.append('poc_mobile[]',form_group.controls['poc_mobile'].value);
      }
    }
    if(this.formInvalid){
      this.error_message = 'Please enter all mandatory fields before proceeding.';
      setTimeout(() => {
        this.error_message = "";
      }, 5000);
      return;
    }
    this._registerService.update_poc_details(formData)
        .subscribe(success =>{
          this._router.navigateByUrl('/register/step-three');
        },error=>{
          console.error(error);
        })
  }
  state = [
    { id: 1, name: 'Maharashtra' },
    { id: 2, name: 'Gujrat' },
    { id: 3, name: 'Punjab' },
    { id: 4, name: 'Rajistan' },
];
  cities = [
      { id: 1, name: 'Mumbai' },
      { id: 2, name: 'Nashik' },
      { id: 3, name: 'Pune' },
      { id: 4, name: 'Ahmednagar' },
  ];

  country = [
      { id: 1, name: 'India' },
      { id: 2, name: 'UAE' },
      { id: 3, name: 'US' },
      { id: 4, name: 'UK' },
  ];
  
  phonePin = [
      { id: 1, name: '+91(IND)' },
      { id: 2, name: '+92(PAK)' },
      { id: 3, name: '+971(UAE)' }
  ];

}
