import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  transactionId: any = ''
  constructor(private route: ActivatedRoute) { 
    this.transactionId = this.route.snapshot.params.transactionId;
  }

  ngOnInit(): void {
    console.log(this.transactionId);
  }

}
