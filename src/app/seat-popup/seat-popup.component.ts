import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SeatPopUpService } from '../shared/seatPopUp.service';
import { ServerService } from '../shared/server.service';

@Component({
  selector: 'app-seat-popup',
  templateUrl: './seat-popup.component.html',
  styleUrls: ['./seat-popup.component.scss']
})
export class SeatPopupComponent implements OnInit {

  subscription     : any;
  currentSeatTitle : string;
  currentSeatUser  : string;
  visible          : boolean;
  titleEditing     : boolean;
  userEditing      : boolean;
  login            : boolean;

  constructor(private seatPopUpService: SeatPopUpService,
              private serverService: ServerService,
              private ref: ChangeDetectorRef) { 
    this.currentSeatTitle = "";
    this.currentSeatUser = "";
  	this.visible = false;
    this.titleEditing = false;
    this.userEditing  = false;
    this.login = false;
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
        this.currentSeatUser = data.UserId; 
        this.ref.detectChanges();
      });

    this.seatPopUpService.editing$.subscribe(
      data => {
        this.titleEditing = data.titleEditing; 
        this.userEditing = data.userEditing; 
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
    this.serverService.updateSeat(this.currentSeatTitle, this.currentSeatUser);
  }
}
