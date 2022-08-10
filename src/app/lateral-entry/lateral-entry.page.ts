import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { LateralApplicantInfo } from '../interface/lateral-applicant-info';
import { ActivatedRoute, Router } from '@angular/router';

import { IonContent, IonSlides } from '@ionic/angular';
import { ApplicantInfoService } from 'src/app/services/application-info.service';
import { RegSelectionService } from '../services/reg-selection.service';

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

  eligible_year: string;
  prev_bit_regno: string;
  application_no: string;
  application_status: string;
  status_response: any;


  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private regSelectionService: RegSelectionService,
    private applicantInfoService: ApplicantInfoService

  ) { }


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
        this.getApplicationData(this.application_no, this.eligible_year);


      });

    } else if (this.eligible_year == "3") {

      this.regSelectionService.getHDITApplicationStatus(this.prev_bit_regno).subscribe((res3) => {

        console.log(res3);
        this.status_response = res3;
        this.application_status = res3['application_status'];
        this.application_no = res3['application_no'];
        console.log(this.application_status + " -> " + this.application_no);
        this.getApplicationData(this.application_no, this.eligible_year);


      });

    }

  }

  getApplicationData(application_no: string, eligible_year: string) {

    this.applicantInfoService.getApplicantInfo(application_no).subscribe((res1) => {


      if (res1 != null) {// get already saved data to update or add

        console.log("application info already saved");
        this.applicantInfoService.aPPLICATION_INFO = res1;
      }

      else if (res1 == null) {  // save application number so we can keep updating personal data

        console.log("application info not saved");

        let obj1: LateralApplicantInfo = {
          application_no: application_no,
          full_name: '',
          full_name_sinhala: '',
          full_name_tamil: '',
          address1: '',
          address2: '',
          address3: '',
          ol_result1: '',
          ol_result2: '',
          ol_subject1: '',
          ol_subject2: '',
          ol_year1: '',
          ol_year2: '',
          al_index_no: '',
          al_type: '',
          al_year: '',
          al_result1: '',
          al_result2: '',
          al_result3: '',
          al_result4: '',
          al_subject1: '',
          al_subject2: '',
          al_subject3: '',
          al_subject4: '',
          amount: '',
          bank: '',
          bank_branch: '',
          bit_registration_no: this.prev_bit_regno,
          citizenship: '',
          country: '',
          disabilities: '',
          district: '',
          dob: '',
          email: '',
          fit_registration_no: '',
          gender: '',
          id_no: '',
          id_type: '',
          initials: '',
          invoice_no: '',
          mobile: '',
          name_marking: '',
          nationality: '',
          need_different_req: '',
          over_payment: '',
          paid_date: '',
          payment_category: '',
          payment_type: '',
          phone: '',
          qualification_pending: '',
          qualification_type: '',
          surcharge: '',
          title: '',
          type: '',
          year: '2022',
          application_status: this.application_status,
          apply_bit_year: eligible_year
        }


        this.applicantInfoService.saveApplicantInfo(obj1).subscribe((res2) => {


          this.applicantInfoService.aPPLICATION_INFO = res2

        });
      }

      console.log("APPLICATION INFO - >   " + this.applicantInfoService.aPPLICATION_INFO);
      this.setupForm();
      this.buildSlides();

    });


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
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      initials: ['', [Validators.required, Validators.minLength(2)]],
      name_marking: ['', [Validators.required, Validators.minLength(2)]],
      title: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      id_type: ['', [Validators.required]],
      id_no: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      dob: [this.defaultDate],
      citizenship: ['Sri Lankan', [Validators.required]],
      nationality: ['Sri Lankan', [Validators.required]]


    });


    this.FormContactInfo = this.formBuilder.group({

      mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address1: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      address3: ['', [Validators.required]],
      district: ['', [Validators.required]],
      country: ['Sri Lanka', [Validators.required]],

    })

    this.FormEducation = this.formBuilder.group({

      qualification_type: ['0', [Validators.required]],
      al_year: ['', [Validators.required]],
      al_index_no: ['', [Validators.required]],

      al_subject1: ['', [Validators.required]],
      al_result1: ['', [Validators.required]],

      al_subject2: ['', [Validators.required]],
      al_result2: ['', [Validators.required]],

      al_subject3: ['', [Validators.required]],
      al_result3: ['', [Validators.required]],

      al_subject4: ['', [Validators.required]],
      al_result4: ['', [Validators.required]],


      fit_year: ['', [Validators.required]],
      fit_registration_no: ['', [Validators.required]],


      ol_year1: ['', [Validators.required]],
      ol_subject1: ['MATHEMATICS'],
      ol_result1: ['', [Validators.required]],
      ol_index1: ['', [Validators.required]], // ADD

      ol_year2: ['', [Validators.required]],
      ol_subject2: ['ENGLISH'],
      ol_result2: ['', [Validators.required]],
      ol_index2: ['', [Validators.required]], //ADD


    });


    this.FormSummary = this.formBuilder.group({
       
 




    });


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


      if (this.FormPersonalInfo.valid) {

        this.updateApplicaionInfo();
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }

    }
    else if (this.currentSlide === 'Contact') {

      if (this.FormContactInfo.valid) {

        this.updateContactInfo();
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }
    } else if (this.currentSlide === 'Education') {


      console.log(this.FormEducation.value);
      if (this.FormEducation.valid) {
      
        this.updateEducationInfo();
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }



    }
    else {

      this.ionSlides.slideNext();
      this.ionContent.scrollToTop();
    }
  }


  changeEducationVisibility(e) {

    console.log(e.target.value);

    this.selectedValue = e.target.value;

    if (this.selectedValue == '2') {

      this.FormEducation.patchValue({

        al_index_no: "",
        al_year: "",
        al_subject1: "",
        al_result1: "",
        al_subject2: "",
        al_result2: "",
        al_subject3: "",
        al_result3: "",
        al_subject4: "",
        al_result4: "",

        fit_registration_no: "",
        fit_year: "",
      })
    } else if (this.selectedValue == '1') {


      this.FormEducation.patchValue({

        fit_index: "",
        fit_year: "",

        al_index_no: "",
        al_year: "",
        al_subject1: "",
        al_result1: "",
        al_subject2: "",
        al_result2: "",
        al_subject3: "",
        al_result3: "",
        al_subject4: "",
        al_result4: "",

      })

    }



  }


  updateApplicaionInfo() {

    let personal_infor_obj: LateralApplicantInfo = this.FormPersonalInfo.value;
    personal_infor_obj.full_name_sinhala = "";
    personal_infor_obj.full_name_tamil = "";
    personal_infor_obj.application_no = this.application_no;

    console.log(personal_infor_obj);

    this.applicantInfoService.updateApplication_PersonalInfo(personal_infor_obj).subscribe((_res2) => { });


  }

  updateContactInfo() {

    let contact_infor_obj: LateralApplicantInfo = this.FormContactInfo.value;

    contact_infor_obj.application_no = this.application_no;

    this.applicantInfoService.updateApplication_ContactInfo(contact_infor_obj).subscribe((_res2) => { });




  }
  updateEducationInfo() {

    let edu_infor_obj: LateralApplicantInfo = this.FormEducation.value;

    edu_infor_obj.application_no = this.application_no;

    this.applicantInfoService.updateApplication_EducationInfo(edu_infor_obj).subscribe((_res2) => { });




  }


  submitApplication() {

    let final_obj: LateralApplicantInfo;
    final_obj = this.FormSummary.value
 
 
    






  }

}

