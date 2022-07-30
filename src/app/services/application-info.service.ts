import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LateralApplicantInfo } from '../interface/lateral-applicant-info';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApplicantInfoService {

  // Define API
  apiURL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // HttpClient API get() method => Fetch application list
  getApplicants(): Observable<LateralApplicantInfo> {
    return this.http
      .get<LateralApplicantInfo>(this.apiURL + '/get_lateral_applicant_info_list')
      .pipe(retry(1), catchError(this.handleError));
  }


  // HttpClient API get() method => Fetch application info
  getApplicantInfo(application_no: any): Observable<LateralApplicantInfo> {
    return this.http
      .get<LateralApplicantInfo>(this.apiURL + '/get_lateral_applicant_info/' + application_no)
      .pipe(retry(1), catchError(this.handleError));
  }


  // HttpClient API post() method => save application info
  saveApplicantInfo(application: any): Observable<LateralApplicantInfo> {
    return this.http
      .post<LateralApplicantInfo>(
        this.apiURL + '/save_lateral_applicant_info',
        JSON.stringify(application),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() method => Update application
  updateApplicationInfo(application_no: any, application: any): Observable<LateralApplicantInfo> {
    return this.http
      .put<LateralApplicantInfo>(
        this.apiURL + '/update_lateral_applicant_info/' + application_no,
        JSON.stringify(application),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }


  // HttpClient API delete() method => Delete application
  deleteApplicationInfo(application_no: any) {
    return this.http
      .delete<LateralApplicantInfo>(this.apiURL + '/deleteLateralApplicantsPersonlInfoById/' + application_no, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
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
