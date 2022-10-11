import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-docs-card',
  templateUrl: './docs-card.component.html',
  styleUrls: ['./docs-card.component.css']
})
export class DocsCardComponent implements OnInit {

  @Input() docData: any;
  @Output() uploadPo = new EventEmitter<any>();
  @Output() viewPdf = new EventEmitter<any>()
  constructor() { }

  ngOnInit(): void {
  }

  onUploadPo(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.uploadPo.next(true);
  }

  onViewPdf(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.viewPdf.next(true);
  }

}
