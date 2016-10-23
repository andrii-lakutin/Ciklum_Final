import { Component, OnInit } from '@angular/core';
import { SeatPopUpService } from '../shared/seatPopUp.service';

@Component({
  selector: 'app-seat-popup',
  templateUrl: './seat-popup.component.html',
  styleUrls: ['./seat-popup.component.scss']
})
export class SeatPopupComponent implements OnInit {

  visible: boolean;
  data: boolean;
  subscription: any;

  constructor(private seatPopUpService: SeatPopUpService) { 
  	this.visible = false;
  }
	
  ngOnInit() {
    this.seatPopUpService.visible$.subscribe(
      data => {
        this.visible = data; 
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
