import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/shared/services/register.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-buyer-pr-acceptance',
  templateUrl: './buyer-pr-acceptance.component.html',
  styleUrls: ['./buyer-pr-acceptance.component.css']
})
export class BuyerPrAcceptanceComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private registerService: RegisterService,
    private _router :Router) { }

  auctionId:any;
  token:any;

  ngOnInit(): void {
    this.auctionId = this.route.snapshot.params.auctionId;
    this.token = this.route.snapshot.params.token;
    console.log(this.auctionId);
    console.log(this.token);
    this.verifyToken(this.token);
  }

  verifyToken(token: any) {
    this.registerService.validateToken({token: token}).subscribe(
      (success) => {
        if(success.success) {
          localStorage.setItem('doctor-sand-user', JSON.stringify(success.result));
          this._router.navigate(['/user/auction/won/'+this.auctionId]);
        }
      },
      error=>{
        console.log(error);
      });
  }
}
