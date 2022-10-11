import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-common-list',
  templateUrl: './common-list.component.html',
  styleUrls: ['./common-list.component.css']
})
export class AdminCommonListComponent implements OnInit {

  isListLoading: boolean = false;
  @Input() listFields: any;
  @Input() dataList: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
