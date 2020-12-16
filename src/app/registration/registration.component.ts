import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialLoginModule, SocialUser } from 'angularx-social-login';
 

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [SocialLoginModule, SocialAuthService]
})
export class RegistrationComponent implements OnInit {

  user: SocialUser;

  constructor(private authService: SocialAuthService,private router: Router) { }

  ngOnInit(): void {


  

}

async signInWithGoogle(): Promise<any> {  

  this.user=await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  console.log(this.user);
  this.router.navigate(['Dashboard']).then(() => {
    window.location.reload();
  });
  //coommeted for temprory pupose above code is hardcoded 
  /*this.userService.socialRegister(this.user).subscribe( data => {
      console.log(data);
      this.router.navigate(['Dashboard']);
    });*/
}

}
