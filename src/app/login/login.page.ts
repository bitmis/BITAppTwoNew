import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

  response: any;
  invalid_DIT_Login: boolean = false;
  invalid_HDIT_Login: boolean = false;
  invalidLogin: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  login(form: any) {

    console.log(form['value']);

    this.authService.login_DIT(form['value']['reg_no'], form['value']['id_no']).subscribe((res) => {

      this.response = res;
      console.log(this.response);
      if (this.response == null) {

        this.loginHDIT(form);

      } else {

        this.router.navigate(['/reg-selection',
          {
            id_no: this.response['id_no'],
            registration_no: this.response['registration_no'],
            year: this.response['year']
          }]);

        this.invalidLogin = false;
      }

    });


  }

  loginHDIT(form: any) {

    this.authService.login_HDIT(form['value']['reg_no'], form['value']['id_no']).subscribe((res) => {

      this.response = res;
      console.log(this.response);
      if (this.response == null) {

        this.invalidLogin = true;

      } else {

        this.router.navigate(['/reg-selection',
          {
            id_no: this.response['id_no'],
            registration_no: this.response['registration_no'],
            year: this.response['year']
          }]);

        this.invalidLogin = false;
      }

    });

  }

}
