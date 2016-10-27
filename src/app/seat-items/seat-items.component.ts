import { Component, OnInit, ChangeDetectorRef , ElementRef} from '@angular/core';
import { ServerService } from '../shared/server.service';
import { SeatPopUpService } from '../shared/seatPopUp.service';
import { OccupantPopUpService } from '../shared/occupantPopUp.service';

declare var jQuery:any;
@Component({
  selector: 'app-seat-items',
  templateUrl: './seat-items.component.html',
  styleUrls: ['./seat-items.component.scss']
})
export class SeatItemsComponent implements OnInit {

  seats: any;	
  dragOverSeat : any;
  login: boolean;
  selectionMode : boolean;
  currentSeatId : string;

  constructor(private serverService: ServerService, 
  			      private seatPopUpService: SeatPopUpService, 
              private occupantPopUpService: OccupantPopUpService,
  			      private ref: ChangeDetectorRef,
              private elementRef: ElementRef) { 
  	this.seats = [];
    this.dragOverSeat;
    this.login = false;
    this.selectionMode = false;
  }

  ngOnInit() {
  	this.ref.detach();

    this.serverService.seats$.subscribe(
      data => {
        if(this.login) {
          this.seats = data; 
          this.makeSeatsDraggable();
        } else {
          //if data comes and this.login === false this means that it's first render
          this.seats = data; 
        }
        this.ref.detectChanges();
      });

    this.seatPopUpService.login$.subscribe(
      login => {
        if(login) {
          this.login = true;
          this.makeSeatsDraggable();
        } else {
          this.login = false;
          this.disableDrag();
        }
        this.ref.detectChanges();
      });

    this.occupantPopUpService.selectionMode$.subscribe(
      data => {
        this.selectionMode = data;
        this.ref.detectChanges();
      });

    this.seatPopUpService.seat$.subscribe(
      data => {
        this.currentSeatId = data._id;
        this.ref.detectChanges();
      });

    this.serverService.getAllSeats();
    this.ref.detectChanges();
  }

  ngAfterViewInit(){
  }

  choose(seat){
    if(this.selectionMode) {
      this.occupantPopUpService.chooseSeat(seat);
    } else {
      this.seatPopUpService.changeVisibility(true);
      this.seatPopUpService.setCurrentSeat(seat);
    }
  }

  setNewCoordinates(newCoord){
    this.serverService.setNewCoords(this.dragOverSeat,newCoord);
  }

  update(seat){
    this.dragOverSeat = seat;
  }

  makeSeatsDraggable(){
    let self = this;
    setTimeout(()=>{
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

      jQuery(this.elementRef.nativeElement.children).draggable('enable');
    }, 300);
    
  }

  disableDrag(){
    jQuery(this.elementRef.nativeElement.children).draggable('disable');
  }

  isHighlighted(seat){
    return seat._id === this.currentSeatId;
  }

  setTitle(seat){
    if(seat.Title === 'No Title') {
      return '';
    } else
      return seat.Title;
  }
}
