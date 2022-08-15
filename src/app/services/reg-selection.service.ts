import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegSelectionService {

  // Define API
  apiURL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // HttpClient API get() method => Fetch application status
  getDITApplicationStatus(prev_registration_no: any): Observable<any> {
    return this.http.get<any>(this.apiURL + '/get_dit_application_status/' + prev_registration_no)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() method => Fetch application status
  getHDITApplicationStatus(prev_registration_no: any): Observable<any> {
    return this.http.get<any>(this.apiURL + '/get_hdit_application_status/' + prev_registration_no)
      .pipe(retry(1), catchError(this.handleError));
  }


  // HttpClient API get() method => Fetch application status
  generateDITApplicationNo(prev_registration_no: string, year: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/save_dit_lateral_application_number/' + prev_registration_no + "/" + year)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() method => Fetch application status
  generateHDITApplicationNo(prev_registration_no: string, year: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/save_hdit_lateral_application_number/' + prev_registration_no + "/" + year)
      .pipe(retry(1), catchError(this.handleError));
  }

  // update DIT application status
  update_DIT_Application_status( application_no:string , application_status:string): Observable<String> {
    return this.http
      .put<String>(
        this.apiURL + '/update_dit_application_status/'+ application_no +"/"+application_status,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // update HDIT application status
  update_HDIT_Application_status( application_no:string , application_status:string): Observable<String> {
    return this.http
      .put<String>(
        this.apiURL + '/update_hdit_application_status/'+ application_no +"/"+application_status,
        this.httpOptions
      )
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
