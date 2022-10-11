import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm-pdf',
  templateUrl: './confirm-pdf.component.html',
  styleUrls: ['./confirm-pdf.component.css']
})
export class ConfirmPdfComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private _router :Router) { }

  ngOnInit(): void {
  }

  onAccept() {
    this._router.navigate(['/user/orders/details/'+ 223344]);
  }

}
