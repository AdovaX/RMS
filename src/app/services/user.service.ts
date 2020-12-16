import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SocialUser } from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  baseurl: string = "http://localhost:4000/";

   apiData = new BehaviorSubject<any>(null);
   apiData$ = this.apiData.asObservable();

  socialRegister(userDetails: SocialUser){

    console.log("service==================>"+JSON.stringify(userDetails));
    return this.http.post(this.baseurl + 'accounts/socialRegister', userDetails);
  }

 
}