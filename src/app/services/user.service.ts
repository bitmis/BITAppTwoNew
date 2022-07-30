

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const AUTH_API = 'http://localhost:8080/api/user_data/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getData (data:any): Observable<any> {
    return this.http.post(AUTH_API + 'get_data', {
      data
    }, httpOptions);
  }


  saveData (data:any): Observable<any> {
    return this.http.post(AUTH_API + 'save_data', {
      data
    }, httpOptions);
  }

}


//https://www.bezkoder.com/angular-12-jwt-auth/