import { Component, OnInit } from '@angular/core';

interface Country {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }
  typesOfShoes: string[] = ['Boots', 'Clogs'];
country: Country[] = [
    {value: 'IN', viewValue: 'India'},
    {value: 'USA', viewValue: 'United states of America'},
    {value: 'JP', viewValue: 'Japan'}
  ];
  ngOnInit(): void {
  }

}
