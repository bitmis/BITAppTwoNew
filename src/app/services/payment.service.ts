import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { LateralApplicantInfo } from '../interface/lateral-applicant-info';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

   // Define API
   apiURL = 'http://localhost:8080/api';
   aPPLICATION_INFO: LateralApplicantInfo;
 
   constructor(private http: HttpClient) { }
   // Http Options
   httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json',
     }),
   };

   

  //-------update payment info------------

  updateApplication_PaymentInfo( application: LateralApplicantInfo): Observable<any> {
    return this.http
      .put<LateralApplicantInfo>(
        this.apiURL + '/update_lateral_applicant_payment_info/',
        JSON.stringify(application),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }


   //-------update payment info status update------------

   updateApplicationstatusTwo( application_no:string): Observable<String> {
    return this.http
      .put<String>(
        this.apiURL + '/update_lateral_applicant_complete_status_two/'+ application_no,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }


  // get payment voucher
  getPaymentVoucher( application_no:string): Observable<any> {
    
      return this.http.get(this.apiURL + '/get_payment_voucher' + "/"+application_no
       );
  }

  

   // Error handling
   handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
