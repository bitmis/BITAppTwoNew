import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
 

@Component({
  selector: 'app-reg-selection',
  templateUrl: './reg-selection.page.html',
  styleUrls: ['./reg-selection.page.scss'],
})
export class RegSelectionPage implements OnInit {

  login_response: any;
  id_no:string;
  eligible_year:string;
  prev_bit_regno:string;
  activatedRoute: any;

  constructor(  private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
   
    this.id_no= this.route.snapshot.paramMap.get('id_no');
    this.prev_bit_regno= this.route.snapshot.paramMap.get('registration_no');
    this.eligible_year= this.route.snapshot.paramMap.get('year');


    console.log("id_no " + this.id_no);
    console.log("prev_bit_regno " + this.prev_bit_regno);
    console.log("eligible_year " + this.eligible_year);
   
 

     
  }

}
