import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class AdminOrderSummaryComponent implements OnInit {

  @Input() OrderData: any;
  constructor() { }

  ngOnInit(): void {
  }

}
