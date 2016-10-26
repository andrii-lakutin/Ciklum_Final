import { Component, OnInit, ChangeDetectorRef , ElementRef} from '@angular/core';
import { ServerService } from '../shared/server.service';
import { SeatPopUpService } from '../shared/seatPopUp.service';
declare var jQuery:any;
@Component({
  selector: 'app-seat-items',
  templateUrl: './seat-items.component.html',
  styleUrls: ['./seat-items.component.scss']
})
export class SeatItemsComponent implements OnInit {

  seats: any;	
  dragOverSeat : any;

  constructor(private serverService: ServerService, 
  			      private seatPopUpService: SeatPopUpService, 
  			      private ref: ChangeDetectorRef,
              private elementRef: ElementRef) { 
  	this.seats = [];
    this.dragOverSeat;
  }

  ngOnInit() {
  	this.ref.detach();

    this.serverService.seats$.subscribe(
      data => {
        this.seats = data; 
        this.makeNewSeatDraggable();
        this.ref.detectChanges();
      });

    this.serverService.getAllSeats();
    this.ref.detectChanges();
  }

  ngAfterViewInit(){

    let self = this;

    this.makeNewSeatDraggable();
  }

  choose(seat){
  	this.seatPopUpService.changeVisibility(true);
  	this.seatPopUpService.setCurrentSeat(seat);
  }

  setNewCoordinates(newCoord){
    this.serverService.setNewCoords(this.dragOverSeat,newCoord);
  }

  test(seat){
    this.dragOverSeat = seat;
  }

  makeNewSeatDraggable(){
    let self = this;

    setTimeout(() => {
      jQuery(this.elementRef.nativeElement.children).draggable({
        start: function(event, ui) {
          //Prevent click at the end of draging
          console.log(jQuery(this).position());
          jQuery(event.toElement).one('click', function(e) { e.stopPropagation(); });
        },
        stop: function(event, ui) {
          let end = jQuery(this).position();
          self.setNewCoordinates(end);
        },
        containment : [180, 80, 1150, 580]
      });
    }, 300);
  }

}
