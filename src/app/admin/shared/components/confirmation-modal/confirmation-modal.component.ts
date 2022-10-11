import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
@Input() modalId: any;
@Input()  mdata: any ;
@Output() confirm: any = new EventEmitter();

  constructor() { }
  showCancel:boolean=true;
  ngOnInit(): void {
    console.log(this.mdata);
    if(this.mdata && this.mdata.hasOwnProperty('showCancel')){
      this.showCancel = this.mdata['showCancel'];
    }
  }

  onConfirm(val: boolean){
    this.confirm.emit(val, this.mdata)
  }




}
