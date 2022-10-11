import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { element } from 'protractor';
import { ListingService } from 'src/app/shared/services';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  generalTerm: any;
  paymentTerm: any;
  deliveryTerm: any;
  constructor(private listingService: ListingService,
              private adminService: AdminService) { }

  ngOnInit(): void {
    this.getTerms();
  }

  getTerms() {
    this.listingService.getTerms().subscribe(
      (success) => {
        console.log(success);
        success.result.forEach((element: any) => {
          if(element.type === 'general') {
            this.generalTerm = element.content;
          } else if(element.type === 'payment') {
            this.paymentTerm = element.content;
          } else {
            this.deliveryTerm = element.content;
          }
        });
      },
      (error) => {
        console.log(error);
        this.deliveryTerm = '';
        this.generalTerm = '';
        this.paymentTerm = '';
      }
    );
  }

  updateTerm(type: any) {
    this.adminService.updateTerm({type: type, content: type == 'general' ? this.generalTerm : (type == 'payment' ? this.paymentTerm: this.deliveryTerm)}).subscribe(
      (success) => {
        console.log(success);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
