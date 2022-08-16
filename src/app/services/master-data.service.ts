import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ALSubject } from '../interface/alsubject';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { IonList } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  // Define API
  apiURL = 'http://localhost:8080/api';
  ALsubjectList: Array<string> =[];
   
  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  

  // HttpClient API get() method => Fetch AL Subject list
  getAlSubjects(): Observable <any> {
    return this.http
      .get<ALSubject>(this.apiURL + '/get_al_subjects')
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
