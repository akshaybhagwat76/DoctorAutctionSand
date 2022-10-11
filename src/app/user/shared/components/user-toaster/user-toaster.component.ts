import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-toaster',
  templateUrl: './user-toaster.component.html',
  styleUrls: ['./user-toaster.component.css']
})
export class UserToasterComponent implements OnInit {

  @Input() body: any;
  @Input() title: any;
  @Input() toastType: any; // 1=success, 2=error, 3=warning, 4=info
  constructor() { }

  ngOnInit(): void {
  }

}
