import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {
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
