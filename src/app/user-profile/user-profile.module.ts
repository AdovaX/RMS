import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
 
@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ]
})
export class UserProfileModule { }
