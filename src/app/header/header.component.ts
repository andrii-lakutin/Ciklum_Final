import { Component, OnInit } from '@angular/core';
import { ServerService } from '../shared/server.service';

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

  constructor(private serverService: ServerService) {
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
  	this.isLogin = true;
  	this.popUpVisible = false;
  	this.inputName = '';
  	this.inputPass = '';
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
}
