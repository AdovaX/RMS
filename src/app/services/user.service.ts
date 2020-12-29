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

  //baseurl: string = "http://localhost:4000/";
  baseurl: string = "http://13.126.170.121:4000/";

   apiData = new BehaviorSubject<any>(null);
   apiData$ = this.apiData.asObservable();

  //Social Login Service
  socialRegister(userDetails: SocialUser){
    console.log("service==================>"+JSON.stringify(userDetails));
    return this.http.post(this.baseurl + 'accounts/socialRegister', userDetails);
    
  }

  //Registration Service
  registerUser(registrationDetails: any){
    console.log("registrationDetails==================>"+JSON.stringify(registrationDetails));
    return this.http.post(this.baseurl + 'accounts/registeremail', registrationDetails);
    //return 'success';
  }
  registerUserPhone(registrationDetails: any){
    console.log("registrationDetails==================>"+JSON.stringify(registrationDetails));
    return this.http.post(this.baseurl + 'accounts/registerphone', registrationDetails);
    //return 'success';
  }

  authenticate(loginDetails:any){
    
    console.log("registrationDetails==================>"+JSON.stringify(loginDetails));
    return this.http.post(this.baseurl + 'auth/authenticate', loginDetails);

  }
 
}