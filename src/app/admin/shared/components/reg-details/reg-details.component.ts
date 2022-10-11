import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';

import { ListingService } from 'src/app/shared/services';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-reg-details',
  templateUrl: './reg-details.component.html',
  styleUrls: ['./reg-details.component.css'],
})
export class RegDetailsComponent implements OnInit {
  @Input() listType: 'SELLER' | 'BUYER' | '' = '';
  @Input() selectedData: any;
  @Input() stateList: any[] = [];
  @Output() backToList = new EventEmitter<any>();

  isEdit: boolean = false;

  // credit details
  creditDetails:any = {};
  creditDetailsForm:any;
  showCreditLimitSection:boolean = false;
  // company and user details
  userDetails: any = {};
  hasUserDetails: boolean = false;
  address_proof: any;
  userDetailsSubmitted: boolean = false;
  userDetailsErrorData: any;

  enableUploadCertificate: boolean = false;
  certificateData: any;
  certificateErrorData: any;

  enableActivateAccount: boolean = false;
  enableDeActivateAccount: boolean = false;
  activateAccountErrorData: any;

  enableSendPaymentLink: boolean = false;
  sendLinkErrorData: any;
  enableInvoice: boolean = false;

  udLoading: boolean = false;
  step_ud: boolean = true;
  step_fill: boolean = false;
  step_payment: boolean = false;

  registerForm: any;
  userDetailsForm: any;

  // listing
  cityList: any = {};

  // POC from
  pocForm: any;
  hasPOCDetails = false;
  POCDetailsSubmitted = false;
  POCDetailsErrorData: any;
  hideCityDrop = false;
  poc_profiles: any = {};
  formInvalid = true;
  error_message: any = '';

  //offline payment
  paymentDetails : any = {};
  offlinePaymentForm : any;
  offlinePaymentLink: boolean = false;
  IsOfflinePaymentAllowed : boolean = false;
  hasPaymentDetails :boolean = false;
  submitPaymentDetailBtn : boolean = true;
  IsValidInvoice : boolean = true;

  //level 2 document upload and security deposit
  IsBuyer: boolean = false;
  sendPaymentLinkSD: boolean = false;
  levelTwoDoc: boolean = false;
  regDocs:any = [];
  IsSdPaymentCompleted = false;
  sdPaymentDetails : any = {};

  regStatus: any = {
    REGISTRATION_INFORMATION_FILLED: '10',
    DOCUMENTS_UPLOADED: '20',
    DELIVERY_CENTRE_DETAILS_UPDATED: '40',
    PICKUP_CENTRE_DETAILS_UPDATED: '30',
    PAYMENT_COMPLETED: '50',
    CERTIFICATE_UPLOADED: '70',
    DASHBOARD_ACTIVATED: '60',
    LVL2_DOCUMENTS_UPLOADED: '80',
    SD_PAYMENT_LINK_SENT : '90',
    SD_PAY_LATER : '95',
    USER_DEACTIVATED : '99',
    SD_PAYMENT_COMPLETED : '100'
  };

  buyerCompanyType: any;
  docError :any = '';
  buyerCompanyTypeError : any = '';

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private listingService: ListingService,
    public urlService: UrlService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getCityList(state_id: any, i: number) {
    this.listingService.getCityListing(state_id).subscribe(
      (success) => {
        this.cityList[state_id] = success.result;
      },
      (error) => {
        this.cityList[state_id] = [];
      }
    );
  }

  // get user details
  async getUserDetails() {
    this.udLoading = true;
    this.hasUserDetails = false;
    this.hasPOCDetails = false;
    this.enableUploadCertificate = false;
    this.enableActivateAccount = false;
    this.enableDeActivateAccount = false;
    this.enableInvoice = false;

    await this.adminService.userDetails(this.selectedData).subscribe(
      (succ) => {
        const userDetails = this.parseRegDetails(succ.result);

        if(userDetails.role_id == 1){
          this.IsBuyer = true;
        }

        switch (userDetails.registration_status) {
          case this.regStatus.REGISTRATION_INFORMATION_FILLED:
            this.hasUserDetails = false;
            break;
          case this.regStatus.DOCUMENTS_UPLOADED:
            this.hasUserDetails = true;
            break;
          case this.regStatus.PICKUP_CENTRE_DETAILS_UPDATED:
          case this.regStatus.DELIVERY_CENTRE_DETAILS_UPDATED:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = true;
            this.IsOfflinePaymentAllowed = true;
            break;
          case this.regStatus.PAYMENT_COMPLETED:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.IsOfflinePaymentAllowed = true;
            this.enableUploadCertificate = true;
            this.enableDeActivateAccount = false;
            if(!this.IsBuyer){
              this.enableActivateAccount = true;
            }
            this.enableInvoice = true;
            this.levelTwoDoc = true;
            break;
          case this.regStatus.LVL2_DOCUMENTS_UPLOADED:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.enableInvoice = true;
            this.enableUploadCertificate = true;
            this.enableActivateAccount = false;
            this.enableDeActivateAccount = false;
            this.IsOfflinePaymentAllowed = true;
            this.levelTwoDoc = true;
            this.sendPaymentLinkSD = true;
            break
          case this.regStatus.SD_PAYMENT_LINK_SENT:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.enableInvoice = true;
            this.enableUploadCertificate = true;
            this.enableActivateAccount = false;
            this.enableDeActivateAccount = false;
            this.IsOfflinePaymentAllowed = true;
            this.levelTwoDoc = true;
            break;
          case this.regStatus.SD_PAYMENT_COMPLETED:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.enableInvoice = true;
            this.enableUploadCertificate = true;
            this.enableActivateAccount = true;
            this.enableDeActivateAccount = false;
            this.IsOfflinePaymentAllowed = true;
            this.levelTwoDoc = true;
            this.IsSdPaymentCompleted = true;
            break;
          case this.regStatus.SD_PAY_LATER:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.enableInvoice = true;
            this.enableUploadCertificate = true;
            this.enableActivateAccount = true;
            this.enableDeActivateAccount = false;
            this.IsOfflinePaymentAllowed = true;
            this.levelTwoDoc = true;
            this.IsSdPaymentCompleted = false;
            break;
          case this.regStatus.DASHBOARD_ACTIVATED:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.enableInvoice = true;
            this.enableUploadCertificate = true;
            this.enableActivateAccount = false;
            this.enableDeActivateAccount = true;
            this.IsOfflinePaymentAllowed = true;
            this.levelTwoDoc = true;
            this.IsSdPaymentCompleted = false;
            break;
          case this.regStatus.USER_DEACTIVATED:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.enableInvoice = true;
            this.enableUploadCertificate = true;
            this.enableActivateAccount = true;
            this.enableDeActivateAccount = false;
            this.IsOfflinePaymentAllowed = true;
            this.levelTwoDoc = true;
            this.IsSdPaymentCompleted = false;
            break;
          // defaul case is for certificate upload / activate dashboard
          // as other cases are already checked then this case is for upload certificate
          default:
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.enableInvoice = true;
            this.enableUploadCertificate = true;
            this.enableActivateAccount = true;
            this.IsOfflinePaymentAllowed = true;
            this.levelTwoDoc = true;
            this.IsSdPaymentCompleted = true;
            this.enableDeActivateAccount = false;
            break;
        }

        // if this user is activated then hide activate button
        if (userDetails.user_activated) {
          this.enableActivateAccount = false;

          if(this.IsBuyer){
            this.showCreditLimitSection = true;
          }
        }
        if(this.IsBuyer){
          this.enableUploadCertificate = false;
        }
        this.userDetails = userDetails;
        this.sdPaymentDetails = userDetails.sd_order_details;
        // initialize form data and update form data information
        this.initUserDetailsForm(userDetails);
        this.initPOCForm(userDetails);
        this.initOfflinePaymaneForm(userDetails);
        this.initCreditDetailsForm(userDetails);
        this.udLoading = false;
      },
      (fail) => {
        this.udLoading = false;
        alert(
          'Oops! An erro occured wile listing data. Please try again later.'
        );
        this.back2List(true);
      }
    );
  }

  // parse fetched user details
  parseRegDetails(listData: any) {
    let result = {
      id: listData.id ? listData.id : '',
      login_id: listData.login_id ? listData.login_id : '',
      role_id: listData.role_id ? listData.role_id : '',
      name: listData.name ? listData.name : '',
      profile_image: listData.profile_image ? listData.profile_image : '',
      address_id: listData.address_id ? listData.address_id : '',
      is_active: listData.is_active ? listData.is_active : '',
      created_on: listData.created_on ? listData.created_on : '',
      updated_on: listData.updated_on ? listData.updated_on : '',
      username: listData.username ? listData.username : '',
      mobile: listData.mobile ? listData.mobile : '',
      email: listData.email ? listData.email : '',
      mobile_verified_on: listData.mobile_verified_on
        ? listData.mobile_verified_on
        : '',
      email_verified_on: listData.email_verified_on
        ? listData.email_verified_on
        : '',
      last_login: listData.last_login ? listData.last_login : '',
      line_1: listData.line_1 ? listData.line_1 : '',
      line_2: listData.line_2 ? listData.line_2 : '',
      landmark: listData.landmark ? listData.landmark : '',
      pincode: listData.pincode ? listData.pincode : '',
      city_id: listData.city_id ? listData.city_id : '',
      state_id: listData.state_id ? listData.state_id : '',
      country_id: listData.country_id ? listData.country_id : '',
      latitude: listData.latitude ? listData.latitude : '',
      longitude: listData.longitude ? listData.longitude : '',
      created_by: listData.created_by ? listData.created_by : '',
      updated_by: listData.updated_by ? listData.updated_by : '',
      state_name: listData.state_name ? listData.state_name : '',
      city_name: listData.city_name ? listData.city_name : '',
      country_name: listData.country_name ? listData.country_name : '',
      user_id: listData.user_id ? listData.user_id : '',
      pan_number: listData.pan_number ? listData.pan_number : '',
      gst_number: listData.gst_number ? listData.gst_number : '',
      tin_number: listData.tin_number ? listData.tin_number : '',
      cin_number: listData.cin_number ? listData.cin_number : '',
      tan_number: listData.tan_number ? listData.tan_number : '',
      address_proof: listData.address_proof ? listData.address_proof : '',
      registration_status: listData.registration_status
        ? listData.registration_status
        : '',
      poc_details: listData.poc_details ? listData.poc_details : [],
      credit_details : listData.credit_details ? listData.credit_details : {},
      ifsc_code: listData.ifsc_code ? listData.ifsc_code : '',
      bank_name: listData.bank_name ? listData.bank_name : '',
      account_number: listData.account_number ? listData.account_number : '',

      certificate: listData.certificate ? listData.certificate : '',
      user_activated: listData.user_activated ? listData.user_activated : 0,
      order_details :listData.order_details ? listData.order_details : null,
      sd_order_details :listData.sd_order_details ? listData.sd_order_details : null,
      reg_docs : listData.reg_docs ? listData.reg_docs : [],
      company_type: listData.company_type ? listData.company_type: ''
    };

    // parse poc details
    result.poc_details = result.poc_details.map((d: any) => {
      return {
        id: d.id ? d.id : '',
        user_id: d.user_id ? d.user_id : '',
        address_id: d.address_id ? d.address_id : '',
        poc_name: d.poc_name ? d.poc_name : '',
        poc_mobile: d.poc_mobile ? d.poc_mobile : '',
        poc_email: d.poc_email ? d.poc_email : '',
        poc_reg_date: d.poc_reg_date ? d.poc_reg_date : '',
        poc_profile: d.poc_profile ? d.poc_profile : '',
        line_1: d.line_1 ? d.line_1 : '',
        line_2: d.line_2 ? d.line_2 : '',
        landmark: d.landmark ? d.landmark : '',
        pincode: d.pincode ? d.pincode : '',
        city_id: d.city_id ? d.city_id : '',
        state_id: d.state_id ? d.state_id : '',
        country_id: d.country_id ? d.country_id : '',
        latitude: d.latitude ? d.latitude : '',
        longitude: d.longitude ? d.longitude : '',
        is_active: d.is_active ? d.is_active : '',
        created_on: d.created_on ? d.created_on : '',
        created_by: d.created_by ? d.created_by : '',
        updated_on: d.updated_on ? d.updated_on : '',
        updated_by: d.updated_by ? d.updated_by : '',
        state_name: d.state_name ? d.state_name : '',
        city_name: d.city_name ? d.city_name : '',
        country_name: d.country_name ? d.country_name : '',
      };
    });

    result.reg_docs = result.reg_docs.map((d:any)=>{
      return {
        document :d.document
      }
    })

    this.buyerCompanyType = listData.company_type ? listData.company_type: '';

    return result;
  }

  // handle back to list
  back2List(refresh: boolean = false) {
    this.backToList.emit({ refresh });
  }

  // handle file selection
  fileBrowseHandler(event: any, name: any, index?: number) {
    debugger;
    const file = event.target.files[0];
    console.log(event.target.files);
    this.regDocs = [];
    switch (name) {
      case 'address_proof':
        this.userDetailsForm.controls['address_proof'] = file;
        this.address_proof = file;
        break;
      case 'certificate':
        this.certificateData = file;
        break;
      case 'poc_profile':
        if (index !== undefined) {
          this.pocForm.controls[index].controls['poc_profile'] = file;
          this.poc_profiles[index] = file;
        }
        break;
      case 'reg_doc':
        let fileArr = event.target.files;
        if(fileArr.length == 0){
          this.regDocs = [];
        }
        for (let index = 0; index < fileArr.length; index++) {
          if(fileArr[index] && fileArr[index].size/1024 > 1024*5) {
            event.target.value = null;
            this.docError = 1;
            return;
          }
          if(fileArr[index] && !(fileArr[index].type == "application/x-zip-compressed" || fileArr[index].type =="application/zip")){
            event.target.value = null;
            this.docError = 0;
            return;
          }
          this.docError = 0;
          this.regDocs.push(fileArr[index]);
        }
        console.log(this.regDocs);
        break;
    }
  }

  // handle fill details form
  async handleSaveClick(e: any) {
    const userDetailsRes = await this.submitUserDetails();
    const pickupDataRes = await this.submitPickupData();
    if (userDetailsRes !== true) {
      this.userDetailsErrorData = userDetailsRes;
      return;
    }
    if (pickupDataRes !== true) {
      this.POCDetailsErrorData = pickupDataRes;
      return;
    }

    this.userDetailsErrorData = null;
    this.POCDetailsErrorData = null;
    this.back2List(true);
  }

  // handle submit user details
  submitUserDetails() {
    return new Promise((resolve, reject) => {
      if (this.hasUserDetails) {
        resolve(true);
      }

      const formValues = this.userDetailsForm.value;
      const formData = new FormData();

      Object.entries(formValues).forEach(([key, value]: any) => {
        if (key !== 'address_proof') {
          value = `${value}`.toUpperCase();
          formData.append(key, value);
        }
      });

      formData.append('address_proof', this.address_proof);
      formData.append('user_id', this.userDetails.user_id);

      this.adminService.updateUserMeta(formData).subscribe(
        (res) => {
          if (res.success) {
            resolve(true);
          } else {
            reject(res);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // handle submit pickup/delivery data
  submitPickupData() {
    return new Promise((resolve, reject) => {
      if (this.hasPOCDetails) {
        resolve(true);
      }

      let formData: any = new FormData();

      const formValues = this.pocForm.value;

      formValues.forEach((formValue: any, i: number) => {
        Object.entries(formValue).forEach(([key, value]: any) => {
          if (!['poc_profile'].includes(key)) {
            value = `${value}`.toUpperCase();
            formData.append(`${key}[]`, value);
          }
        });

        formData.append('poc_profile[]', this.poc_profiles[i] || []);
      });

      formData.append('user_id', this.userDetails.user_id);

      this.adminService.updatePickupDeliveryData(formData).subscribe(
        (res) => {
          if (res.success) {
            resolve(true);
            return;
          } else {
            reject(res);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // init user details form
  initUserDetailsForm(detail: any) {
    let hasDetail = false;
    if (detail.tin_number) {
      hasDetail = true;
    }

    this.userDetailsForm = this.fb.group({
      tin_number: new FormControl(
        {
          value: hasDetail && detail.tin_number !== '-' ? detail.tin_number : '',
          disabled: hasDetail && detail.tin_number !== '-',
        },
        [
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern('[0-9]{11}'),
        ]
      ),
      cin_number: new FormControl(
        {
          value: hasDetail && detail.cin_number !== '-' ? detail.cin_number : '',
          disabled: hasDetail && detail.cin_number !== '-',
        },
        [
          Validators.minLength(21),
          Validators.maxLength(21),
          Validators.pattern(
            '[A-Za-z]{1}[0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}'
          ),
        ]
      ),
      tan_number: new FormControl(
        {
          value: hasDetail && detail.tan_number !== '-' ? detail.tan_number : '',
          disabled: hasDetail && detail.tan_number !== '-',
        },
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}'),
        ]
      ),

      address_proof: new FormControl(
        {
          value: hasDetail ? detail.address_proof : null,
          disabled: hasDetail,
        },
        Validators.required
      ),

      bank_name: new FormControl(
        {
          value: hasDetail ? detail.bank_name : '',
          disabled: hasDetail,
        }
      ),
      ifsc_code: new FormControl(
        {
          value: hasDetail ? (detail.ifsc_code && detail.ifsc_code =='-' ? '' : detail.ifsc_code)  : '',
          disabled: hasDetail,
        },
        [Validators.pattern('[A-Za-z]{4}[A-Za-z0-9]{11}')]
      ),
      account_number: new FormControl(
        {
          value: hasDetail ? detail.account_number : '',
          disabled: hasDetail,
        }
      ),
    });
  }

  // POC Form
  initPOCForm(details: any) {
    this.pocForm = this.fb.array([]);

    if (details.poc_details && details.poc_details.length > 0) {
      details.poc_details.forEach((detail: any) => {
        this.createPOCForm(detail);
      });
    } else {
      this.createPOCForm();
    }
  }

  //offline Payment Form
  initOfflinePaymaneForm(userdetails:any){
    let details = userdetails.order_details;
    this.IsValidInvoice = (details && !details.transaction_id && details.payment_remarks == 'Pan number already exists') ? false : true;
    this.hasPaymentDetails = (details && details.transaction_id) ? true : false;
    // this.IsOfflinePaymentAllowed = (!details || !details.transaction_id) || hasDetail ? true : false;
    this.paymentDetails = details;
    this.offlinePaymentForm = this.fb.group({
      transaction_id: new FormControl(
        {
          value: this.hasPaymentDetails && details && details.transaction_id ? details.transaction_id : '',
          disabled: this.hasPaymentDetails
        },
        Validators.required
      ),
      payment_remarks:new FormControl(
        {
          value : this.hasPaymentDetails && details && details.payment_remarks ? details.payment_remarks : '',
          disabled: this.hasPaymentDetails
        },
        Validators.required
      ),
      amount:new FormControl(
        {
          value : this.hasPaymentDetails && details && details.amount ? details.amount : '',
          disabled: this.hasPaymentDetails
        },
        [Validators.required,
        Validators.pattern('([0-9]*[.])?[0-9]+')]
      ),
      tax_amount:new FormControl(
        {
          value : this.hasPaymentDetails && details && details.tax_amount ? details.tax_amount : '',
          disabled: this.hasPaymentDetails
        },
        [Validators.required,
          Validators.pattern('([0-9]*[.])?[0-9]+')]
      )
    })
  }

  // create a new POC form
  createPOCForm(detail: any = {}) {
    let hasDetail = false;
    if (Object.keys(detail).length) {
      hasDetail = true;
    }

    this.pocForm.push(
      this.fb.group({
        address: new FormControl(
          { value: hasDetail ? detail.line_1 : '', disabled: hasDetail },
          [Validators.required]
        ),
        landmark: new FormControl(
          { value: hasDetail ? detail.landmark : '', disabled: hasDetail },
          [Validators.required]
        ),
        state_id: new FormControl(
          { value: hasDetail ? detail.state_id : '', disabled: hasDetail },
          [Validators.required]
        ),
        city_id: new FormControl(
          { value: hasDetail ? detail.city_id : '', disabled: hasDetail },
          [Validators.required]
        ),
        pincode: new FormControl(
          { value: hasDetail ? detail.pincode : '', disabled: hasDetail },
          [Validators.required]
        ),
        poc_profile: new FormControl({
          value: hasDetail ? detail.poc_profile : null,
          disabled: hasDetail,
        }),
        poc_name: new FormControl(
          { value: hasDetail ? detail.poc_name : '', disabled: hasDetail },
          [Validators.required]
        ),
        poc_email: new FormControl(
          { value: hasDetail ? detail.poc_email : '', disabled: hasDetail },
          [
            Validators.required,
            Validators.pattern(
              '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,3}'
            ),
          ]
        ),
        poc_mobile: new FormControl(
          { value: hasDetail ? detail.poc_mobile : '', disabled: hasDetail },
          [Validators.required]
        ),
        // poc_reg_date: new FormControl(
        //   { value: hasDetail ? detail.poc_reg_date : '', disabled: hasDetail },
        //   [Validators.required]
        // ),
      })
    );
  }

  // delete a POC form
  deletePOCForm(index: number, group: any) {
    this.pocForm.removeAt(index);
    delete this.poc_profiles[index];

    if (group.controls.state_id && this.cityList[group.controls.state_id]) {
      delete this.cityList[group.controls.state_id];
    }
  }

  // handle edit form click
  onFillDetailsClick(e: any) {
    this.isEdit = true;
  }

  // upload certificate
  uploadCertificate(e: any) {
    const fd: any = new FormData();
    fd.append('certificate', this.certificateData);
    fd.append('user_id', this.userDetails.user_id);

    this.adminService
      .uploadCertificate(fd)
      .subscribe(
        (res) => {
          if (res.success) {
            this.certificateData = null;
            this.certificateErrorData = null;
            this.back2List(true);
          } else {
            this.certificateErrorData = res;
          }
        },
        (err: any) => {
          this.certificateErrorData = err;
        }
      );

    console.log(this.certificateErrorData);
  }

  // activate an account
  activateAccount(e: any) {
    this.adminService
      .activateAccount({
        user_id: this.userDetails.user_id,
      })
      .subscribe(
        (res) => {
          if (res.success) {
            this.activateAccountErrorData = null;
            this.back2List(true);
          } else {
            this.activateAccountErrorData = res;
          }
        },
        (err: any) => {
          this.activateAccountErrorData = err;
        }
      );

    console.log(this.activateAccountErrorData);
  }

  // deactivate an account
  deActivateAccount(e: any) {
    this.adminService
      .deActivateAccount({
        user_id: this.userDetails.user_id,
      })
      .subscribe(
        (res) => {
          if (res.success) {
            this.activateAccountErrorData = null;
            this.back2List(true);
          } else {
            this.activateAccountErrorData = res;
          }
        },
        (err: any) => {
          this.activateAccountErrorData = err;
        }
      );

    console.log(this.activateAccountErrorData);
  }

  // send payment link
  onSendPaymentLinkClick(e: any) {
    this.adminService
      .sendPaymentLink({
        user_id: this.userDetails.user_id,
      })
      .subscribe(
        (res) => {
          if (res.success) {
            this.sendLinkErrorData = null;
            this.back2List(true);
          } else {
            this.sendLinkErrorData = res;
          }
        },
        (err: any) => {
          this.sendLinkErrorData = err;
        }
      );

    console.log(this.sendLinkErrorData);
  }

  calculateTaxAmout(){
    this.offlinePaymentForm.controls['tax_amount'].setValue('');
    var amount = this.offlinePaymentForm.controls['amount'].value;
    if(amount > 0){
      var tax_amount = amount * 0.18;
      this.offlinePaymentForm.controls['tax_amount'].setValue(tax_amount.toFixed(2));
    }
  }

  addOfflinePaymentDetails(){
    const formValues = this.offlinePaymentForm.value;

    formValues.user_id =this.userDetails.user_id;
    console.log(formValues);
    this.adminService.createOfflinePayment(formValues).subscribe(
      (res) => {
        console.log(res);
        if (res.success) {
            this.hasUserDetails = true;
            this.hasPOCDetails = true;
            this.enableSendPaymentLink = false;
            this.enableUploadCertificate = true;
            this.enableActivateAccount = true;
            this.enableInvoice = true;
            this.paymentDetails = formValues;
            this.submitPaymentDetailBtn = false;
        } else {

        }
      }
    );
  }

  // upload documents
  uploadDocuments(e: any) {
    if(!this.buyerCompanyType){
      console.log('company not selected');
      this.buyerCompanyTypeError = 'company not selected';
      return;
    }else{
      this.buyerCompanyTypeError = '';
    }
    const fd: any = new FormData();
    for (let index = 0; index < this.regDocs.length; index++) {
      fd.append('docs[]', this.regDocs[index]);
    }
    fd.append('user_id', this.userDetails.user_id);
    fd.append('company_type', this.buyerCompanyType);

    this.adminService
      .uploadDocuments(fd)
      .subscribe(
        (res) => {
          if (res.success) {
            this.regDocs = [];
            this.back2List(true);
          } else {
            console.log(res);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  // send security deposit payment link
  onSendSDPaymentLinkClick(pay_later: number) {
    const body = {
      user_id: this.userDetails.user_id,
      pay_later:pay_later
    }
    this.adminService
      .sendSDPaymentLink(body)
      .subscribe(
        (res) => {
          if (res.success) {
            this.sendLinkErrorData = null;
            this.back2List(true);
          } else {
            this.sendLinkErrorData = res;
          }
        },
        (err: any) => {
          this.sendLinkErrorData = err;
        }
      );

    console.log(this.sendLinkErrorData);
  }

  initCreditDetailsForm(userDetails:any){
    this.creditDetails = userDetails.credit_details;
    this.creditDetailsForm = this.fb.group({
      user_id : new FormControl(this.creditDetails.user_id, Validators.required),
      credit_limit : new FormControl('',Validators.required)  
    })
  }

  addUpdateCreditDetails(){
      let form = this.creditDetailsForm.value;
      this.adminService.updateCreditLimit(form)
          .subscribe((res:any) =>{
            if(res.success)
            this.back2List(true);
          },(error:any) =>{
            console.log(error);
          })
  }
}
