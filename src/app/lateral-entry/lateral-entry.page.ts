import { ALSubject } from './../interface/alsubject';
import { MasterDataService } from './../services/master-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { LateralApplicantInfo } from '../interface/lateral-applicant-info';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertController, IonContent, IonSlides } from '@ionic/angular';
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

  districtList = ['Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota',
    'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale',
    'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Trincomalee', 'Vavuniya'];

  countryList = ['Sri Lanka', 'India', 'Maldives', 'Nepal', 'Pakistan'];
  citizenshipList = ['Sri Lankan', 'Other'];
  nationalityList = ['Sri Lankan', 'Other'];
  titleList = ['Mr.', 'Ms.', 'Dr', 'Rev.'];
  titleListNew = [{ "key": "3", "value": "Mr." }, { "key": "6", "value": "Ms." }, { "key": "1", "value": "Rev." }, { "key": "2", "value": "Dr." }]


  yearList = ['2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000'];
  ALsubjectList: Array<string> = [];
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

  disable_submit: boolean = false;


  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private regSelectionService: RegSelectionService,
    private applicantInfoService: ApplicantInfoService,
    private masterDataService: MasterDataService,
    private alertController: AlertController

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

    this.masterDataService.getAlSubjects().subscribe((al_subject_list) => {

      var al_list: Array<string> = [];
      al_subject_list.forEach(function (al_value: { [x: string]: string; }) {
        //  console.log(al_value['al_subject']);
        al_list.push(al_value['al_subject']);


      });
      this.masterDataService.ALsubjectList = al_list;
      this.ALsubjectList = this.masterDataService.ALsubjectList;



    });


  }

  getApplicationData(application_no: string, eligible_year: string) {

    this.applicantInfoService.getApplicantInfo(application_no).subscribe((res1) => {


      if (res1 != null) {// get already saved data to update or add

        console.log("application info already saved");
        this.applicantInfoService.aPPLICATION_INFO = res1;
        this.setupForm();
        this.buildSlides();
      }

      else if (res1 == null) {  // save application number so we can keep updating personal data

        console.log("application info not saved");

        let initial_object: LateralApplicantInfo = {
          application_no: application_no,
          full_name: '',
          full_name_sinhala: '',
          full_name_tamil: '',
          address1: '',
          address2: '',
          address3: '',
          ol_result1: "0",
          ol_result2: "0",
          ol_subject1: '',
          ol_subject2: '',
          ol_year1: "0",
          ol_year2: "0",
          al_index_no: '',
          al_type: '',
          al_year: '0',
          al_result1: "0",
          al_result2: "0",
          al_result3: "0",
          al_result4: "0",
          al_subject1: "0",
          al_subject2: "0",
          al_subject3: "0",
          al_subject4: "0",
          amount: '',
          bank: '',
          bank_branch: '',
          bit_registration_no: this.prev_bit_regno,
          citizenship: "0",
          country: "0",
          disabilities: 'No',
          district: "0",
          dob: '',
          email: '',
          fit_registration_no: '',
          gender: "0",
          id_no: '',
          id_type: "0",
          initials: '',
          invoice_no: '',
          mobile: '',
          name_marking: '',
          nationality: "0",
          need_different_req: '0',
          over_payment: '',
          paid_date: '',
          payment_category: '',
          payment_type: '',
          phone: '',
          qualification_pending: '0',
          qualification_type: '0',
          surcharge: '',
          title: "0",
          type: '',
          year: '2022',
          application_status: this.application_status,
          apply_bit_year: eligible_year,
          ol_index1: '',
          ol_index2: '',
          fit_year: ''
        }


        this.applicantInfoService.saveApplicantInfo(initial_object).subscribe((res2) => {


          this.applicantInfoService.aPPLICATION_INFO = res2;
          console.log("APPLICATION INFO - >   " + this.applicantInfoService.aPPLICATION_INFO);
          this.setupForm();
          this.buildSlides();

        });
      }




    });


  }

  ionViewDidEnter() {
    this.ionSlides.updateAutoHeight();
  }

  buildSlides() {
    const slides = ['Personal-Information', 'Contact-Information', 'Education', 'Summary'];
    this.currentSlide = slides[0];
    this.slides = slides;
  }
  setupForm() {

    console.log(this.applicantInfoService.aPPLICATION_INFO);

    this.FormPersonalInfo = this.formBuilder.group({
      full_name: [this.applicantInfoService.aPPLICATION_INFO.full_name, [Validators.required, Validators.minLength(2)]],
      initials: [this.applicantInfoService.aPPLICATION_INFO.initials, [Validators.required, Validators.minLength(1)]],
      name_marking: [this.applicantInfoService.aPPLICATION_INFO.name_marking, [Validators.required, Validators.minLength(2)]],
      title: [this.applicantInfoService.aPPLICATION_INFO.title, [Validators.required]],
      gender: [this.applicantInfoService.aPPLICATION_INFO.gender, [Validators.required]],
      id_type: [this.applicantInfoService.aPPLICATION_INFO.id_type, [Validators.required]],
      id_no: [this.applicantInfoService.aPPLICATION_INFO.id_no, [Validators.required]],
      dob: [this.applicantInfoService.aPPLICATION_INFO.dob],
      citizenship: [this.applicantInfoService.aPPLICATION_INFO.citizenship, [Validators.required]],
      nationality: [this.applicantInfoService.aPPLICATION_INFO.nationality, [Validators.required]],
      disabilities: [this.applicantInfoService.aPPLICATION_INFO.disabilities, [Validators.required]],


    });

    this.FormContactInfo = this.formBuilder.group({

      mobile: [this.applicantInfoService.aPPLICATION_INFO.mobile, [Validators.required, Validators.pattern('^[0-9]+$')]],
      phone: [this.applicantInfoService.aPPLICATION_INFO.phone, [Validators.required, Validators.pattern('^[0-9]+$')]],
      address1: [this.applicantInfoService.aPPLICATION_INFO.address1, [Validators.required]],
      address2: [this.applicantInfoService.aPPLICATION_INFO.address2, [Validators.required]],
      address3: [this.applicantInfoService.aPPLICATION_INFO.address3, [Validators.required]],
      district: [this.applicantInfoService.aPPLICATION_INFO.district, [Validators.required]],
      country: [this.applicantInfoService.aPPLICATION_INFO.country, [Validators.required]],
      email: [this.applicantInfoService.aPPLICATION_INFO.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]


    })

    this.selectedValue = this.applicantInfoService.aPPLICATION_INFO.qualification_type;
    this.FormEducation = this.formBuilder.group({

      qualification_type: [this.applicantInfoService.aPPLICATION_INFO.qualification_type, [Validators.required]],
      al_year: [this.applicantInfoService.aPPLICATION_INFO.al_year, [Validators.required]],
      al_index_no: [this.applicantInfoService.aPPLICATION_INFO.al_index_no, [Validators.required]],

      al_subject1: [this.applicantInfoService.aPPLICATION_INFO.al_subject1, [Validators.required]],
      al_result1: [this.applicantInfoService.aPPLICATION_INFO.al_result1, [Validators.required]],

      al_subject2: [this.applicantInfoService.aPPLICATION_INFO.al_subject2, [Validators.required]],
      al_result2: [this.applicantInfoService.aPPLICATION_INFO.al_result2, [Validators.required]],

      al_subject3: [this.applicantInfoService.aPPLICATION_INFO.al_subject3, [Validators.required]],
      al_result3: [this.applicantInfoService.aPPLICATION_INFO.al_result3, [Validators.required]],

      al_subject4: [this.applicantInfoService.aPPLICATION_INFO.al_subject4, [Validators.required]],
      al_result4: [this.applicantInfoService.aPPLICATION_INFO.al_result4, [Validators.required]],


      fit_year: [this.applicantInfoService.aPPLICATION_INFO.fit_year, [Validators.required]],
      fit_registration_no: [this.applicantInfoService.aPPLICATION_INFO.fit_registration_no, [Validators.required]],


      ol_year1: [this.applicantInfoService.aPPLICATION_INFO.ol_year1, [Validators.required]],
      ol_subject1: ['MATHEMATICS'],
      ol_result1: [this.applicantInfoService.aPPLICATION_INFO.ol_result1, [Validators.required]],
      ol_index1: [this.applicantInfoService.aPPLICATION_INFO.ol_index1, [Validators.required]], // ADD

      ol_year2: [this.applicantInfoService.aPPLICATION_INFO.ol_year2, [Validators.required]],
      ol_subject2: ['ENGLISH'],
      ol_result2: [this.applicantInfoService.aPPLICATION_INFO.ol_result2, [Validators.required]],
      ol_index2: [this.applicantInfoService.aPPLICATION_INFO.ol_index2, [Validators.required]], //ADD


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


    if (this.currentSlide === 'Personal-Information') {

      if (this.FormPersonalInfo.valid) {

        this.savePersonalInfo();
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }

    }
    else if (this.currentSlide === 'Contact-Information') {

      if (this.FormContactInfo.valid) {

        this.saveContactInfo();
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }
    } else if (this.currentSlide === 'Education') {


      console.log(this.FormEducation);
      this.saveEducationInfo();
      this.ionSlides.slideNext();
      this.ionContent.scrollToTop();

      // if (this.FormEducation.valid) {

      //   this.ionSlides.slideNext();
      //   this.ionContent.scrollToTop();
      // }



    }

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
  changeEducationVisibility(e) {

    console.log(e.target.value);

    this.selectedValue = e.target.value;

    if (this.selectedValue == '2') {

      this.FormEducation.patchValue({})
    } else if (this.selectedValue == '1') {

      this.FormEducation.patchValue({})

    }



  }

  changeButtonDisability() {
    this.disable_submit = !this.disable_submit;
    console.log(this.disable_submit);
  }

  savePersonalInfo() {

    let personal_infor_obj: LateralApplicantInfo = this.FormPersonalInfo.value;
    personal_infor_obj.full_name_sinhala = "";
    personal_infor_obj.full_name_tamil = "";
    personal_infor_obj.application_no = this.application_no;
    personal_infor_obj.apply_bit_year = this.eligible_year;
    personal_infor_obj.application_status = this.application_status;


    console.log(personal_infor_obj);

    this.applicantInfoService.updateApplication_PersonalInfo(personal_infor_obj).subscribe((_res2) => { });
    console.log("PERSONAL INFO SAVED");


  }

  saveContactInfo() {

    let contact_infor_obj: LateralApplicantInfo = this.FormContactInfo.value;

    contact_infor_obj.application_no = this.application_no;
    contact_infor_obj.apply_bit_year = this.eligible_year;
    contact_infor_obj.application_status = this.application_status;

    this.applicantInfoService.updateApplication_ContactInfo(contact_infor_obj).subscribe((result) => {
      console.log("CONTACT INFO SAVED" + result);

    });




  }
  saveEducationInfo() {

    let edu_infor_obj: LateralApplicantInfo = this.FormEducation.value;

    edu_infor_obj.application_no = this.application_no;
    edu_infor_obj.apply_bit_year = this.eligible_year;
    edu_infor_obj.application_status = this.application_status;

    this.applicantInfoService.updateApplication_EducationInfo(edu_infor_obj).subscribe((_res2) => {
      console.log("EDU INFO SAVED");
    });




  }


  submitApplication() {

    //application no , status - submit
    this.applicantInfoService.updateApplicationstatusOne(this.application_no).subscribe((result) => {
      console.log("Status One SAVED " + result);

      if (result == "1") {



        if (this.eligible_year == "2") {

          this.regSelectionService.update_DIT_Application_status(this.application_no, "payment_pending").subscribe((result2) => {
            this.router.navigate(['/reg-selection',
              {
                application_no: this.application_no,
                application_status: "payment_pending",
                id_no: this.applicantInfoService.aPPLICATION_INFO.id_no,
                registration_no: this.prev_bit_regno,
                year: this.eligible_year
              }]);
          });

        }
        else if (this.eligible_year == "3") {

          this.regSelectionService.update_HDIT_Application_status(this.application_no, "payment_pending").subscribe((result2) => {

            this.router.navigate(['/reg-selection',
              {
                application_no: this.application_no,
                application_status: "payment_pending",
                id_no: this.applicantInfoService.aPPLICATION_INFO.id_no,
                registration_no: this.prev_bit_regno,
                year: this.eligible_year
              }]);
          });

        }


      }
    });




  }

}

