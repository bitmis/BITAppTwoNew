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
  invalidLogin: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  login(form: any) {

    console.log(form['value']);

    this.authService.login(form['value']['reg_no'], form['value']['id_no']).subscribe((res) => {


      this.response = res;
      console.log(this.response);
      if (this.response == null) {

        this.invalidLogin = true;

      } else {

      //  this.router.navigateByUrl('/main-menu');
        // Navigate to /results?page=1
       // this.router.navigate(['/main-menu'], { queryParams: { login_response: this.response['registration_no'] } });
        this.router.navigate(['/reg-selection', { id: '11212', foo: this.response['year'] }]);
        this.invalidLogin = false;
      }

    });
  }

}
