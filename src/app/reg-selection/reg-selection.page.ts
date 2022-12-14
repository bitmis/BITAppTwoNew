import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApplicantInfoService } from '../services/application-info.service';
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
  new_application_no: string;



  show_start_application: boolean = false;
  show_continue_application: boolean = false;
  show_payment_application: boolean = false;
  show_complete_application: boolean = false;


  constructor(private route: ActivatedRoute, private router: Router, 
    private regSelectionService: RegSelectionService, private httpClient: HttpClient,public loadingController: LoadingController) { }

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
        //console.log("-application no -- " + this.status_response['application_no']);

        if (this.status_response == null) {

          this.show_start_application = true;
        } else {
          this.new_application_no = this.status_response['application_no'];

          if (this.status_response['application_status'] == "pending") {
            this.show_continue_application = true;
          }

          else if (this.status_response['application_status'] == "payment_pending") {
            this.show_payment_application = true;

          } else if (this.status_response['application_status'] == "completed") {
            this.show_complete_application = true;
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
          this.new_application_no = this.status_response['application_no'];

          if (this.status_response['application_status'] == "pending") {
            this.show_continue_application = true;
          }

          else if (this.status_response['application_status'] == "payment_pending") {
            this.show_payment_application = true;
          }
          else if (this.status_response['application_status'] == "completed") {
            this.show_complete_application = true;
          }
        }

      });

    }


  }

  createApplicationNumber(eligible_year: string) {

    if (eligible_year == "2") {

      console.log("DIT application no created");
      this.regSelectionService.generateDITApplicationNo(this.prev_bit_regno, this.eligible_year).subscribe((res1) => {

        this.router.navigate(['lateral-entry',
          {
            prev_registration_no: this.prev_bit_regno,
            eligible_year: this.eligible_year
          }]);



      });

    } if (eligible_year == "3") {

      console.log("HDIT application no created");

      this.regSelectionService.generateHDITApplicationNo(this.prev_bit_regno, this.eligible_year).subscribe((res1) => {
        this.router.navigate(['lateral-entry',
          {
            prev_registration_no: this.prev_bit_regno,
            eligible_year: this.eligible_year
          }]);




      });




    }
  }


  continueApplication() {


    console.log("continue application called");
    this.router.navigate(['lateral-entry',
      {
        prev_registration_no: this.prev_bit_regno,
        eligible_year: this.eligible_year
      }]);
  }

  continuePayments() {


    this.router.navigate(['payment',
      {
        prev_registration_no: this.prev_bit_regno,
        eligible_year: this.eligible_year
      }]);
  }

  downloadApplication() {

    let paymentVoucherURL = "http://localhost:8080/api/get_application/" + this.new_application_no;
    this.presentLoading();

    this.httpClient.get(paymentVoucherURL, { responseType: 'blob' }).subscribe(res => {
      let blob = new Blob([res], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);

      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      //   TO OPEN PDF ON BROWSER IN NEW TAB
      //window.open(pdfUrl, '_blank');

      //   TO DOWNLOAD PDF TO YOUR COMPUTER
      PDF_link.download = this.new_application_no + "_BIT2022_Application.pdf";
      PDF_link.click();
    });


  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please Wait',
      duration: 3000,
      
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

}
