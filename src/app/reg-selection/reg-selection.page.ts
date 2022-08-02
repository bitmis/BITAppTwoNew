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
  application_no_response: any;


  id_no: string;
  eligible_year: string;
  prev_bit_regno: string;



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


    this.getApplicationStatus(this.eligible_year);

  }

  getApplicationStatus(eligible_year: string) {

    if (eligible_year == "2") {

      this.regSelectionService.getDITApplicationStatus(this.prev_bit_regno).subscribe((res) => {

        this.status_response = res;
        console.log("- -- " + this.status_response);
        if (this.status_response == null) {
  
          this.show_start_application = true;
        } else {
  
          if (this.status_response['application_status'] == "pending") {
            this.show_continue_application = true;
          }
  
          else if (this.status_response['application_status'] == "application_submit") {
            this.show_payment_application = true;
          }
        }
  
      });
  



    } else if (eligible_year == "3") {
      this.regSelectionService.getHDITApplicationStatus(this.prev_bit_regno).subscribe((res) => {

        this.status_response = res;
        console.log("- -- " + this.status_response);
        if (this.status_response == null) {
  
          this.show_start_application = true;
        } else {
  
          if (this.status_response['application_status'] == "pending") {
            this.show_continue_application = true;
          }
  
          else if (this.status_response['application_status'] == "application_submit") {
            this.show_payment_application = true;
          }
        }
  
      });

    }

    
  }

  createApplicationNumber(eligible_year:string) {

    console.log("application no created");
    this.regSelectionService.generateDITApplicationNo(this.prev_bit_regno, this.eligible_year).subscribe((res) => { });



    this.regSelectionService.getDITApplicationStatus(this.prev_bit_regno).subscribe((res) => {
      this.application_no_response = res;
      console.log("++++   " + this.application_no_response['application_no']);

    });

  }

}
