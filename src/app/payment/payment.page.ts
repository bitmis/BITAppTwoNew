import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { RegSelectionService } from '../services/reg-selection.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  


  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private actionSheetCtrl: ActionSheetController,
    private regSelectionService: RegSelectionService,
    private httpClient: HttpClient) { }



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
      paid_amount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],

      over_payment: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      surcharge: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],

      bank_name: ['Peoples Bank', [Validators.required]],
      bank_branch: ['', [Validators.required]],


      invoice_no: ['', [Validators.required]],




    });

    console.log(this.FormPayment['value']['type']);

    this.payment_method = this.FormPayment['value']['type'];

    console.log("this.payment_method  " + this.payment_method);

  }

  async presentActionSheet1() {

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
  });



  savePaymentInfo() {


    
    console.log(this.FormPayment['value']['type']);

    if(this.FormPayment.valid){
      console.log("Validd");
      console.log(this.FormPayment['value']);
    }


  }

  changeEducationVisibility(e) {
    console.log(e.target.value);
    this.payment_method = e.target.value;

    if (this.payment_method == '1') {

      this.FormPayment.patchValue({

        bank_name :"Peoples Bank",
        invoice_no :"0"
      });


    }
    else if (this.payment_method == '2') {

      this.FormPayment.patchValue({

        bank_name :"Peoples Bank"
      });

    }




  }

  //https://medium.com/@rameez.s.shaikh/upload-and-retrieve-images-using-spring-boot-angular-8-mysql-18c166f7bc98

  //https://www.techiediaries.com/ionic-formdata-multiple-file-upload-tutorial/




  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;


  //Gets called when the user selects an image
  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
  }
  //Gets called when the user clicks on submit to upload the image
  onUpload() {
    console.log(this.selectedFile);

    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

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
}


