import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
              private seatPopUpService: SeatPopUpService,
              private ref: ChangeDetectorRef) {
  	this.inputName = '';
  	this.inputPass = '';
  	this.withoutSeatCheckbox = false;
  	this.popUpVisible = false;
  	this.isLogin = false;
  }

  ngOnInit(){
    this.ref.detach();
    this.ref.detectChanges();
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
    this.ref.detectChanges();
  }

  failureLogin(){
    alert('No access for you.');
  }

  logout(){
  	this.isLogin = false;
    this.ref.detectChanges();
  }

  toggleLoginPopUpVisibility(){
  	this.popUpVisible ? this.popUpVisible = false : this.popUpVisible = true; 
    this.ref.detectChanges();
  }

  newSeat(){
    this.serverService.createNewSeat();
    this.seatPopUpService.changeVisibility(true);
    this.ref.detectChanges();
  }
}
