import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { SeatPopUpService } from '../shared/seatPopUp.service';

@Component({
  selector: 'app-seat-items',
  templateUrl: './seat-items.component.html',
  styleUrls: ['./seat-items.component.scss']
})
export class SeatItemsComponent implements OnInit {

  seats: any;	

  constructor(private serverService: ServerService, 
  			  private seatPopUpService: SeatPopUpService, 
  			  private ref: ChangeDetectorRef) { 
  	this.seats = [];
  }

  ngOnInit() {
  	this.ref.detach();

    this.serverService.seats$.subscribe(
      data => {
        this.seats = data; 
        this.ref.detectChanges();
      });

    this.serverService.getAllSeats();
    this.ref.detectChanges();
  }

  choose(seat){
  	this.seatPopUpService.changeVisibility(true);
  	this.seatPopUpService.setCurrentSeat(seat);
  }

}
