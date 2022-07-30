
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, ControlContainer } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ActionSheetController, IonContent, IonSlides, NavController } from '@ionic/angular';
import { ApplicantInfoService } from 'src/app/services/application-info.service';

@Component({
  selector: 'app-lateral-entry',
  templateUrl: './lateral-entry.page.html',
  styleUrls: ['./lateral-entry.page.scss'],
})
export class LateralEntryPage implements OnInit {

  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  @ViewChild(IonSlides, { static: false }) ionSlides: IonSlides;
  @ViewChild('FormPersonalInfo', { static: false }) FormPersonalInfoRef: NgForm;
  @ViewChild('FormContactInfo', { static: false }) FormContactInfoRef: NgForm;
  @ViewChild('FormEducation', { static: false }) FormEducationRef: NgForm;
  @ViewChild('FormSummary', { static: false }) FormSummaryRef: NgForm;




  public slidesOpts = {
    allowTouchMove: false,
    autoHeight: true,
  };

  public slides: string[];
  public currentSlide: string;
  public isBeginning: boolean = true;
  public isEnd: boolean = false;

  public FormPersonalInfo: FormGroup;
  public FormContactInfo: FormGroup;
  public FormEducation: FormGroup;
  public FormSummary: FormGroup;


  defaultDate = "2000-01-01";
  isSubmitted = false;

  districtList = ['Gampaha', 'Colombo', 'Kalutara', 'Galle', 'Matara'];
  countryList = ['Sri Lanka', 'India', 'Maldives', 'Nepal', 'Pakistan'];
  citizenshipList = ['Sri Lankan', 'Other'];
  titleList = ['Mr.', 'Ms.', 'Dr', 'Rev.'];


  yearList = ['2021', '2020', '2019'];
  ALsubjectList = ['Chemistry', 'Maths'];
  resultList = ['A', 'B', 'C', 'S', 'F'];
  entry_qualification = [{ "key": "1", "value": "GCE A/L Qualified" }, { "key": "2", "value": "UCSC FIT Qualified" }
  ]

  showAL: boolean = false;
  showFIT: boolean = false;
  selectedValue: String;


  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    //  public restAPI: ApplicantInfoService
  ) { }


  // saveStudent(applicantionInfo: any) {
  //   this.restAPI.saveApplicantInfo(applicantionInfo).subscribe((data: {}) => {

  //   });
  // }

  ngOnInit() {

    this.setupForm();
    this.buildSlides();
  }

  ionViewDidEnter() {
    this.ionSlides.updateAutoHeight();
  }

  buildSlides() {
    const slides = ['Personal', 'Contact', 'Education', 'Summary'];
    this.currentSlide = slides[0];
    this.slides = slides;
  }
  setupForm() {

    this.FormPersonalInfo = this.formBuilder.group({
      name: ['Walakuluuu Arachchige Dona Paramee Medhavi Gunethilake', [Validators.required, Validators.minLength(2)]],
      initial: ['W.A.D.P.M', [Validators.required, Validators.minLength(2)]],
      lastname: ['Gunethilake', [Validators.required, Validators.minLength(2)]],
      title: ['Ms.', [Validators.required]],
      gender: ['Female', [Validators.required]],
      idtype: ['NIC', [Validators.required]],
      idno: ['925839487V', [Validators.required]],
      email: ['parameegunethilake@gmail.com', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      dob: [this.defaultDate],
      citizenship: ['Sri Lankan', [Validators.required]],
      nationality: ['Sri Lankan', [Validators.required]]


    });


    this.FormContactInfo = this.formBuilder.group({

      mobile: ['0774951044', [Validators.required, Validators.pattern('^[0-9]+$')]],
      phone: ['0332265589', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address1: ['397', [Validators.required]],
      address2: ['Kossinna', [Validators.required]],
      address3: ['Ganemulla', [Validators.required]],
      district: ['Gampaha', [Validators.required]],
      country: ['Sri Lanka', [Validators.required]],

    })

    this.FormEducation = this.formBuilder.group({

      academic_type: ['0', [Validators.required]],
      al_year: ['2020', [Validators.required]],
      al_index: ['123234', [Validators.required]],
      subject1_name: ['Sinhala', [Validators.required]],
      subject1_result: ['A', [Validators.required]],
      subject2_name: ['IT', [Validators.required]],
      subject2_result: ['B', [Validators.required]],
      subject3_name: ['English', [Validators.required]],
      subject3_result: ['A', [Validators.required]],
      fit_year: ['2020', [Validators.required]],
      fit_index: ['111', [Validators.required]],


      ol_maths_year: ['2020', [Validators.required]],
      ol_maths_index: ['111222', [Validators.required]],
      ol_maths_result: ['A', [Validators.required]],
      ol_english_year: ['2020', [Validators.required]],
      ol_eng_index: ['111555', [Validators.required]],
      ol_english_result: ['S', [Validators.required]],


    });


    this.FormSummary = this.formBuilder.group({});


  }
  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.FormPersonalInfo.get('dob').setValue(date, {
      onlyself: true
    })
  }
  get errorControl() {
    return this.FormPersonalInfo.controls;
  }
  async onSlidesChanged() {
    const index = await this.ionSlides.getActiveIndex();
    this.currentSlide = this.slides[index];
    this.isBeginning = await this.ionSlides.isBeginning();
    this.isEnd = await this.ionSlides.isEnd();
  }

  onSlidesDidChange() {
    this.ionContent.scrollToTop();
  }

  onBackButtonTouched() {
    this.ionSlides.slidePrev();
    this.ionContent.scrollToTop();
  }

  onNextButtonTouched() {



    if (this.currentSlide === 'Personal') {

      //this.FormPersonalInfoRef.onSubmit(undefined);
      console.log(this.FormPersonalInfo['value']);

      if (this.FormPersonalInfo.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }

    }
    else if (this.currentSlide === 'Contact') {

      //this.FormEducationRef.onSubmit(undefined);
      console.log(this.FormContactInfo);
      console.log(this.FormContactInfo.valid);


      if (this.FormContactInfo.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }
    } else if (this.currentSlide === 'Education') {

      //this.FormEducationRef.onSubmit(undefined);
      console.log(this.FormEducation);
      console.log(this.FormEducation.valid);


      if (this.FormEducation.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }



    } else if (this.currentSlide === 'Payment') {

      //this.FormPaymentRef.onSubmit(undefined);

      // if (this.FormPayment.valid) {


      //   // this.navCtrl.navigateRoot('/thanks', {
      //   //   animated: true,
      //   //   animationDirection: 'forward',
      //   // });
      // }

    } else {

      this.ionSlides.slideNext();
      this.ionContent.scrollToTop();
    }
  }



  changeEducationVisibility(e) {


    console.log(e.target.value);

    this.selectedValue = e.target.value;

    if (this.selectedValue == '2') {

      this.FormEducation.patchValue({

        al_index: "temp",
        al_year: "temp",
        subject1_name: "temp",
        subject1_result: "temp",
        subject2_name: "temp",
        subject2_result: "temp",
        subject3_name: "temp",
        subject3_result: "temp",

        fit_index: "",
        fit_year: "",
      })
    } else if (this.selectedValue == '1') {


      this.FormEducation.patchValue({

        fit_index: "temp",
        fit_year: "temp",

        al_index: "",
        al_year: "",
        subject1_name: "",
        subject1_result: "",
        subject2_name: "",
        subject2_result: "",
        subject3_name: "",
        subject3_result: "",

      })

    }



  }




  onNextButtonTouchedNew() {


    if (this.currentSlide === 'Personal') {

      console.log("Personal info Ok");
      console.log(this.FormPersonalInfo['value']);



      if (this.FormPersonalInfo.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }

    }
    else if (this.currentSlide === 'Contact') {

      //this.FormEducationRef.onSubmit(undefined);
      console.log(this.FormContactInfo);
      console.log(this.FormContactInfo.valid);


      if (this.FormContactInfo.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }
    } else if (this.currentSlide === 'Education') {

      //this.FormEducationRef.onSubmit(undefined);
      console.log(this.FormEducation);
      console.log(this.FormEducation.valid);


      if (this.FormEducation.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }


    } else {

      this.ionSlides.slideNext();
      this.ionContent.scrollToTop();
    }
  }


}

