import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SeatPopUpService } from '../shared/seatPopUp.service';
import { ServerService } from '../shared/server.service';
import { OccupantPopUpService } from '../shared/occupantPopUp.service';

@Component({
  selector: 'app-seat-popup',
  templateUrl: './seat-popup.component.html',
  styleUrls: ['./seat-popup.component.scss']
})
export class SeatPopupComponent implements OnInit {

  subscription     : any;
  optimization     : any;
  searchResult     : any;
  currentUser      : any;
  currentSeatTitle : string;
  search           : string;
  visible          : boolean;
  titleEditing     : boolean;
  userEditing      : boolean;
  login            : boolean;

  constructor(private seatPopUpService: SeatPopUpService,
              private serverService: ServerService,
              private occupantPopUpService: OccupantPopUpService,
              private ref: ChangeDetectorRef) { 
    this.currentSeatTitle = "";
  	this.visible = false;
    this.titleEditing = false;
    this.userEditing  = false;
    this.login = false;
    this.search = '';
    this.searchResult = [];
    this.currentUser;
  }
	
  ngOnInit() {
    this.ref.detach();

    this.seatPopUpService.visible$.subscribe(
      data => {
        let login = this.seatPopUpService.checkIsLogin();
        login ? this.login = true : this.login = false;
        this.visible = data; 
        this.ref.detectChanges();
      });

    this.seatPopUpService.seat$.subscribe(
      data => {
        this.currentSeatTitle = data.Title; 
        this.search = data.UserId; 
        this.ref.detectChanges();
      });

    this.seatPopUpService.editing$.subscribe(
      data => {
        this.titleEditing = data.titleEditing; 
        this.userEditing = data.userEditing; 
        this.ref.detectChanges();
      });

    this.serverService.users$.subscribe(
      users => {
        if(users.whoAsk === 'seatPopUp' || users.whoAsk === 'any') {
          this.searchResult = users.data;
        }
        this.ref.detectChanges();
      });

    this.seatPopUpService.occupant$.subscribe(
      occupant => {
        this.currentUser = occupant;
        this.ref.detectChanges();
      });
    this.ref.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  titleEdit(newState: boolean){
    let login = this.seatPopUpService.checkIsLogin();
    if(login) {
      this.seatPopUpService.titleEdit(newState);
    }
  }

  userEdit(newState: boolean){
    this.currentUser = 'Free';
    let login = this.seatPopUpService.checkIsLogin();
    if(login) {
      this.seatPopUpService.userEdit(newState);
    }
  }

  exit(){
    this.seatPopUpService.changeVisibility(false);
    this.ref.detectChanges();
  }

  save(){
    if(this.currentUser) {
      this.serverService.updateSeat(this.currentSeatTitle, this.currentUser);
    } else{
      //if user not chosen
      let emptyUser = {
        Name   : 'Free',
        LastName: ''
      }
      this.serverService.updateSeat(this.currentSeatTitle, emptyUser);
    }  
  }

  openOccupant(){
    if(this.currentUser) {
      this.occupantPopUpService.changeVisibility(true);
      this.occupantPopUpService.setCurrent(this.currentUser);
    }
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
    this.serverService.search(this.search, 'seatPopUp');
  }

  selectUser(newUser){
    if(newUser.SeatId === 'Free') {
      this.selectUserConfirm(newUser);
    } else {
      if (confirm(`You really want to change seat for ${newUser.Name + newUser.LastName} ?
        His previous seat will become empty!`)) {
        this.selectUserConfirm(newUser);
      }
    }
    this.ref.detectChanges();
  }

  selectUserConfirm(newUser){
    let userId = newUser.Name + " " + newUser.LastName;
    this.serverService.clearPreviousSeat(userId, newUser.SeatId);
    this.serverService.seatUser(newUser._id, this.currentSeatTitle);
    this.search = newUser.Name + ' ' + newUser.LastName;
    this.currentUser = newUser;
    this.currentUser.SeatId = this.currentSeatTitle;
    this.searchResult = [];
  }
}
