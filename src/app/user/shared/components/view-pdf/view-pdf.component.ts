import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.css']
})
export class ViewPdfComponent implements OnInit {

  @Input() height: any;
  @Input() width: any;
  @Input() pdfUrl: any;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log(this.pdfUrl);
    // console.log(this.getPdfUrl())
  }

  getPdfUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }

}
