import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { RegSelectionService } from '../services/reg-selection.service';

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

  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private actionSheetCtrl: ActionSheetController,
    private regSelectionService: RegSelectionService) { }



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

      paymentmethod: ['null', [Validators.required]],
      paid_date: ['', [Validators.required]],
      paid_amount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],

      over_payment: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      surcharge: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      bank_name: ['', [Validators.required]],
      bank_branch: ['', [Validators.required]],




    });
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
        width: 600,
        height: 600,
        
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

      console.log(blob);

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

}
