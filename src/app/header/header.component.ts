import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { SeatPopUpService } from '../shared/seatPopUp.service';
import { OccupantPopUpService } from '../shared/occupantPopUp.service';


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
  search              : string;
  isLogin             : boolean;
  withoutSeatCheckbox : boolean;
  popUpVisible        : boolean;
  optimization        : any;
  searchResult        : any;

  constructor(private serverService: ServerService,
              private seatPopUpService: SeatPopUpService,
              private occupantPopUpService: OccupantPopUpService,
              private ref: ChangeDetectorRef) {
  	this.inputName = '';
  	this.inputPass = '';
    this.search = '';
  	this.withoutSeatCheckbox = false;
  	this.popUpVisible = false;
  	this.isLogin = false;
    this.optimization;
    this.searchResult = [];
  }

  ngOnInit(){
    this.ref.detach();

    this.serverService.users$.subscribe(
      data => {
        this.searchResult = data;
        this.ref.detectChanges();
      });
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
    this.seatPopUpService.setLogin(true);
    this.ref.detectChanges();
  }

  failureLogin(){
    alert('No access for you.');
  }

  logout(){
  	this.isLogin = false;
    this.seatPopUpService.setLogin(false);
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
  //search
  searchEvent(event: KeyboardEvent) {
    this.search = (<HTMLInputElement>event.target).value;
    if(this.search) {
      this.optimize();
    } else{
      this.serverService.onEmptySearch();
    }
  }
  optimize(){
    if (this.optimization) {
        // clear the timeout, if one is pending
        clearTimeout(this.optimization);
        this.optimization = null;
    }

    let trueContext = this.goToServer.bind(this);

    this.optimization = setTimeout(trueContext, 300);
  }

  goToServer(){
    this.serverService.search(this.search);
  }

  selectUser(user){
    this.occupantPopUpService.setCurrent(user);
    this.occupantPopUpService.changeVisibility(true);
    this.search = '';
    this.searchResult = [];
    this.ref.detectChanges();
  }

}
