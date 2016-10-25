import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OccupantPopUpService } from '../shared/occupantPopUp.service';

@Component({
  selector: 'app-occupant-popup',
  templateUrl: './occupant-popup.component.html',
  styleUrls: ['./occupant-popup.component.scss']
})
export class OccupantPopupComponent implements OnInit {

  name    : string;
  lastName: string;
  mail    : string;
  seatId  : string;
  visible : boolean;

  constructor(private occupantPopUpService: OccupantPopUpService,
  			  private ref: ChangeDetectorRef) { 
    this.visible = false;
  	this.name = '';
  	this.lastName = '';
  	this.mail = '';
  	this.seatId;
  }

  ngOnInit() {
  	this.ref.detach();
    this.occupantPopUpService.occupant$.subscribe(
      data => {
        this.name = data.Name; 
        this.lastName = data.LastName;
        this.mail = data.Mail;
        this.seatId = data.SeatId;
        this.ref.detectChanges();
      });

    this.occupantPopUpService.visible$.subscribe(
      data => {
        this.visible = data; 
        this.ref.detectChanges();
      });
    this.ref.detectChanges();
  }

  exit(){
    this.occupantPopUpService.changeVisibility(false);
    this.ref.detectChanges();
  }

}
