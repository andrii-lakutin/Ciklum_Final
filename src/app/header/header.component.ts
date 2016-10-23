import { Component, OnInit } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { SeatPopUpService } from '../shared/seatPopUp.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  inputName           : string;
  inputPass           : string;
  name                : string;
  pass                : string;
  isLogin             : boolean;
  withoutSeatCheckbox : boolean;
  popUpVisible        : boolean;

  constructor(private serverService: ServerService,
              private seatPopUpService: SeatPopUpService) {
  	this.inputName = '';
  	this.inputPass = '';
  	this.withoutSeatCheckbox = false;
  	this.popUpVisible = false;
  	this.isLogin = false;
  }

  ngOnInit(){

  }

  login(name, pass){
  	this.serverService.loginUser(name, pass)
  	    .then(
          res => {
          	console.log(res);
          	this.successLogin();
          },
          error => {
          	console.log(`Rejected: ${error}`);
          	this.failureLogin();
          }
        )
  }	

  successLogin(){
  	this.popUpVisible = false;
  	this.inputName = '';
  	this.inputPass = '';
  	this.isLogin = true;

  	// console.log(this) There is a bug: property is update, but ngIf do nothing(not always, just random); 
  }

  failureLogin(){
    alert('No access for you.');
  }

  logout(){
  	this.isLogin = false;
  }

  toggleLoginPopUpVisibility(){
  	this.popUpVisible ? this.popUpVisible = false : this.popUpVisible = true ; 
  }

  newSeat(){
    this.seatPopUpService.changeVisibility(true);
  }
}
