import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  @Input() body: any;
  @Input() title: any;
  @Input() toastType: any; // 1=success, 2=error, 3=warning, 4=info
  constructor() { }

  ngOnInit(): void {
  }

}
