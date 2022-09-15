import { PaymentService } from './../services/payment.service';
import { LateralApplicantInfo } from './../interface/lateral-applicant-info';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { RegSelectionService } from '../services/reg-selection.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicantInfoService } from '../services/application-info.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  @ViewChild('FormPayment', { static: false }) FormPaymentRef: NgForm;

  public imagePath1: SafeResourceUrl;
  public imagePath2: SafeResourceUrl;


  FormPayment: any;

  eligible_year: string;
  prev_bit_regno: string;
  application_no: string;
  application_status: string;
  status_response: any;

  payment_method: string = '0';

  showVoucher: boolean = false;



  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private actionSheetCtrl: ActionSheetController,
    private regSelectionService: RegSelectionService,
    private httpClient: HttpClient,
    private paymentService: PaymentService,
    private applicantInfoService: ApplicantInfoService,
    private alertController: AlertController) { }



  ngOnInit() {

    this.prev_bit_regno = this.route.snapshot.paramMap.get('prev_registration_no');
    this.eligible_year = this.route.snapshot.paramMap.get('eligible_year');

    console.log(this.prev_bit_regno + " -> " + this.eligible_year);

    if (this.eligible_year == "2") {

      this.regSelectionService.getDITApplicationStatus(this.prev_bit_regno).subscribe((res2) => {

        console.log(res2);

        this.status_response = res2;
        this.application_status = res2['application_status'];
        this.application_no = res2['application_no'];
        console.log(this.application_status + " -> " + this.application_no);


      });

    } else if (this.eligible_year == "3") {

      this.regSelectionService.getHDITApplicationStatus(this.prev_bit_regno).subscribe((res3) => {

        console.log(res3);
        this.status_response = res3;
        this.application_status = res3['application_status'];
        this.application_no = res3['application_no'];
        console.log(this.application_status + " -> " + this.application_no);



      });

    }

    this.setUpForm();
  }

  setUpForm() {

    this.FormPayment = this.formBuilder.group({

      type: ['0', [Validators.required]],
      payment_type: ['2', [Validators.required]],
      payment_category: ['1', [Validators.required]],
      paid_date: ['', [Validators.required]],
      amount: ['1800', [Validators.required, Validators.pattern('^[0-9]+$')]],

      over_payment: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      surcharge: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],

      bank: ['Peoples Bank', [Validators.required]],
      bank_branch: ['', [Validators.required]],


      invoice_no: ['', [Validators.required]],




    });

    console.log(this.FormPayment['value']['type']);

    this.payment_method = this.FormPayment['value']['type'];

    console.log("this.payment_method  " + this.payment_method);

  }


  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: '',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  savePaymentInfo() {



    console.log(this.FormPayment['value']['type']);
    console.log(this.FormPayment['value']);
    if (this.FormPayment.valid) {
      console.log("Validd");
      console.log(this.FormPayment['value']);

      let payment_infor_obj: LateralApplicantInfo = this.FormPayment.value;

      payment_infor_obj.application_no = this.application_no;
      payment_infor_obj.apply_bit_year = this.eligible_year;
      payment_infor_obj.application_status = "completed";

      this.paymentService.updateApplication_PaymentInfo(payment_infor_obj).subscribe((result) => {

        if (result == "1") {
          console.log("PAYMENT INFO SAVED ");
          this.completeSubmission();
        } else {

          this.presentAlert("Error occured While Saving Payments")
        }

      });


    }


  }
  completeSubmission() {


    this.paymentService.updateApplicationstatusTwo(this.application_no).subscribe((result) => {
      console.log("Status two SAVED " + result);

      if (result == "1") {

        if (this.eligible_year == "2") {

          this.regSelectionService.update_DIT_Application_status(this.application_no, "completed").subscribe((result2) => {
            this.router.navigate(['/reg-selection',
              {
                application_no: this.application_no,
                application_status: "completed",
                id_no: this.applicantInfoService.aPPLICATION_INFO.id_no,
                registration_no: this.prev_bit_regno,
                year: this.eligible_year
              }]);
          });

        }
        else if (this.eligible_year == "3") {

          this.regSelectionService.update_HDIT_Application_status(this.application_no, "completed").subscribe((result2) => {

            this.router.navigate(['/reg-selection',
              {
                application_no: this.application_no,
                application_status: "completed",
                id_no: this.applicantInfoService.aPPLICATION_INFO.id_no,
                registration_no: this.prev_bit_regno,
                year: this.eligible_year
              }]);
          });

        }


      }
    });




  }


  changePaymentVisibility(e) {
    console.log(e.target.value);
    this.payment_method = e.target.value;

    if (this.payment_method == '1') {

      this.FormPayment.patchValue({

        bank_name: "Peoples Bank",
        invoice_no: "0"
      });


    }
    else if (this.payment_method == '2') {

      this.FormPayment.patchValue({

        bank_name: "Peoples Bank"
      });

    }

  }







  //selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;

  selectedImage_1:File;
  selectedImage_2:File;


  //Gets called when the user selects an image
  // public onFileChanged(event) {
  //   //Select File
  //   this.selectedFile = event.target.files[0];
  //   console.log(this.selectedFile);
  // }

  public onImageOneChanged(event) {
    //Select Image 1
    this.selectedImage_1 = event.target.files[0];
    console.log(this.selectedImage_1);
    this.onUploadImageOne() ;
  }
  onUploadImageOne() {
    console.log(this.selectedImage_1);

    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedImage_1, this.application_no+"_1.jpg");
    
    //Make a call to the Spring Boot Application to save the image
    this.httpClient.post('http://localhost:8080/api/upload', uploadImageData, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200) {
          this.message = 'Image uploaded successfully';
        } else {
          this.message = 'Image not uploaded successfully';
        }
      }
      );
  }
  public onImageTwoChanged(event) {
    //Select Image 2
    this.selectedImage_2 = event.target.files[0];
    console.log(this.selectedImage_2);
    this.onUploadImageTwo() ;
  }

  onUploadImageTwo() {
    console.log(this.selectedImage_2);

    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedImage_2, this.application_no+"_2.jpg");

    //Make a call to the Spring Boot Application to save the image
    this.httpClient.post('http://localhost:8080/api/upload', uploadImageData, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200) {
          this.message = 'Image uploaded successfully';
        } else {
          this.message = 'Image not uploaded successfully';
        }
      }
      );
  }


  //Gets called when the user clicks on submit to upload the image
  // onUpload() {
  //   console.log(this.selectedFile);

  //   //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
  //   const uploadImageData = new FormData();
  //   uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

  //   //Make a call to the Spring Boot Application to save the image
  //   this.httpClient.post('http://localhost:8080/api/upload', uploadImageData, { observe: 'response' })
  //     .subscribe((response) => {
  //       if (response.status === 200) {
  //         this.message = 'Image uploaded successfully';
  //       } else {
  //         this.message = 'Image not uploaded successfully';
  //       }
  //     }
  //     );
  // }
  //Gets called when the user clicks on retieve image button to get the image from back end
  getImage() {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.httpClient.get('http://localhost:8080/api/get/' + this.imageName)
      .subscribe(
        res => {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
      );
  }



  downloadPaymentVoucher() {


    let paymentVoucherURL = "http://localhost:8080/api/get_payment_voucher/" + this.application_no;

    this.httpClient.get(paymentVoucherURL, { responseType: 'blob' }).subscribe(res => {
      let blob = new Blob([res], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);

      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      //   TO OPEN PDF ON BROWSER IN NEW TAB
      //window.open(pdfUrl, '_blank');

      //   TO DOWNLOAD PDF TO YOUR COMPUTER
      PDF_link.download = this.application_no + "_payment_voucher.pdf";
      PDF_link.click();
    });
  }
}


 //https://medium.com/@rameez.s.shaikh/upload-and-retrieve-images-using-spring-boot-angular-8-mysql-18c166f7bc98

  //https://www.techiediaries.com/ionic-formdata-multiple-file-upload-tutorial/

/*  async presentActionSheet1() {

  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Choose an option',
    buttons: [{
      text: 'Photo Library',
      handler: () => {
        this.chooseImage1(CameraSource.Photos);
      }
    }, {
      text: 'Camera',
      handler: () => {
        this.chooseImage1(CameraSource.Camera);
      }
    }, {
      text: 'Cancel',
      role: 'cancel'
    }]
  });

  return await actionSheet.present();
}

async chooseImage1(source: CameraSource) {

  try {

    const image = await Camera.getPhoto({
      quality: 70,
      width: 600,
      height: 600,

      allowEditing: true,
      correctOrientation: true,
      source: source,
      resultType: CameraResultType.Uri,
    });

    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
    this.imagePath1 = safeUrl;

    const response = await fetch(image.webPath);
    const blob = await response.blob();

    const base64 = await this.convertBlobToBase64(blob) as string;

    // Send encoded string to server...

  } catch (error) {
    console.warn(error);
  }

}

async presentActionSheet2() {

  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Choose an option',
    buttons: [{
      text: 'Photo Library',
      handler: () => {
        this.chooseImage2(CameraSource.Photos);
      }
    }, {
      text: 'Camera',
      handler: () => {
        this.chooseImage2(CameraSource.Camera);
      }
    }, {
      text: 'Cancel',
      role: 'cancel'
    }]
  });

  return await actionSheet.present();
}

async chooseImage2(source: CameraSource) {

  try {

    const image = await Camera.getPhoto({
      quality: 70,
      width: 400,
      height: 500,

      allowEditing: true,
      correctOrientation: true,
      source: source,
      resultType: CameraResultType.Uri,
    });

    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
    this.imagePath2 = safeUrl;

    const response = await fetch(image.webPath);
    const blob = await response.blob();

    const base64 = await this.convertBlobToBase64(blob) as string;

    console.log(base64);

    // Send encoded string to server...

  } catch (error) {
    console.warn(error);
  }

}

convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader;
  reader.onerror = reject;
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(blob);
}); */