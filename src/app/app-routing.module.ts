import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
 import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'Registration', component: RegistrationComponent },
  { path: 'Dashboard', component: DashboardComponent },
  { path: 'Privacypolicy', component: PrivacypolicyComponent },
   {path: 'Profile',loadChildren: () => import('./user-profile/user-profile.module').
then(module => module.UserProfileModule)},
 ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
