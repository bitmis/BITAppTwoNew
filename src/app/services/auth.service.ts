import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const AUTH_API = 'http://localhost:8080/api';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(reg_no: string, id_no: string): Observable<any> {
    return this.http.get(AUTH_API + '/get_dit_regno_nic' + "/"+reg_no+"/"+id_no
     );
  }
}
//https://www.bezkoder.com/angular-12-jwt-auth/