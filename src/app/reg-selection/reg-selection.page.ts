import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { RegSelectionService } from '../services/reg-selection.service';


@Component({
  selector: 'app-reg-selection',
  templateUrl: './reg-selection.page.html',
  styleUrls: ['./reg-selection.page.scss'],
})
export class RegSelectionPage implements OnInit {

  status_response: any;
  id_no: string;
  eligible_year: string;
  prev_bit_regno: string;
  activatedRoute: any;


  show_start_application: boolean = false;
  show_continue_application: boolean = false;
  show_payment_application: boolean = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private regSelectionService: RegSelectionService) { }

  ngOnInit() {

    this.id_no = this.route.snapshot.paramMap.get('id_no');
    this.prev_bit_regno = this.route.snapshot.paramMap.get('registration_no');
    this.eligible_year = this.route.snapshot.paramMap.get('year');


    console.log("id_no " + this.id_no);
    console.log("prev_bit_regno " + this.prev_bit_regno);
    console.log("eligible_year " + this.eligible_year);


    this.getApplicationStatus();

  }

  getApplicationStatus() {

    this.regSelectionService.getApplicationStatus(this.prev_bit_regno).subscribe((res) => {

      this.status_response = res;
      console.log("- -- " + this.status_response);
      if (this.status_response == null) {

        this.show_start_application = true;
      } else {


        
       }

    });

  }

  createApplicationNumber(){

    console.log("application no created");
    this.regSelectionService.generateApplicationNo(this.prev_bit_regno , this.eligible_year).subscribe((res) => {

      this.status_response = res;
      console.log("- -- " + this.status_response);
    });



  }

}
