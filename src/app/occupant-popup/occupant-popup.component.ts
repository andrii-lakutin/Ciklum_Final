import { Component, OnInit, ChangeDetectorRef, ElementRef} from '@angular/core';
import { OccupantPopUpService } from '../shared/occupantPopUp.service';
import { SeatPopUpService } from '../shared/seatPopUp.service';
import { ServerService } from '../shared/server.service';

declare var jQuery:any;
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
  seatIdBeforeSelection : string;
  visible : boolean;
  login   : boolean;
  seatAfterSelection : any;
  currentOccupant    : any;

  constructor(private occupantPopUpService: OccupantPopUpService,
              private seatPopUpService: SeatPopUpService,
              private serverService: ServerService,
  			      private ref: ChangeDetectorRef,
              private elementRef: ElementRef) { 
    this.visible = false;
  	this.name = '';
  	this.lastName = '';
  	this.mail = '';
  	this.seatId;
    this.seatIdBeforeSelection;
    this.login = false;
    this.seatAfterSelection;
    this.currentOccupant;
  }

  ngOnInit() {
  	this.ref.detach();
    this.occupantPopUpService.occupant$.subscribe(
      data => {
        this.currentOccupant = data;
        this.name = data.Name; 
        this.lastName = data.LastName;
        this.mail = data.Mail;
        this.seatId = data.SeatId;
        this.ref.detectChanges();
      });

    this.occupantPopUpService.visible$.subscribe(
      data => {
        this.visible = data; 
        setTimeout(()=>{
          jQuery(this.elementRef.nativeElement.children[0]).draggable({containment: 'body'});
        },300);
        this.ref.detectChanges();
      });

    this.seatPopUpService.login$.subscribe(
      login => {
        if(login) {
          this.login = true;
        } else {
          this.login = false;
        }
        this.ref.detectChanges();
      });

    this.occupantPopUpService.seat$.subscribe(
      data => {
        this.seatAfterSelection = data;
        this.seatId = data.Title; 
        this.ref.detectChanges();
      });
    this.ref.detectChanges();
  }

  selectionModeEnable(){
    this.seatIdBeforeSelection = this.seatId;
    this.seatId = 'Selection Mode';
    this.occupantPopUpService.changeSelectionMode(true);
    this.ref.detectChanges();
  }

  exit(){
    this.occupantPopUpService.changeVisibility(false);
    this.occupantPopUpService.changeSelectionMode(false);
    this.seatId = this.seatIdBeforeSelection;
    this.ref.detectChanges();
  }

  selectSeat(){
    this.serverService.getCurrentSeatByTitle(this.seatId).then((res)=>{
      this.seatPopUpService.setCurrentSeat(JSON.parse(res["_body"]));
    });
  }

  saveChanges(){
    let previousSeat = this.seatPopUpService.getCurrentSeat();
    let emptyUser = {
        Name   : 'Free',
        LastName: ''
      }
    //if do nothing and save - do nothing.
    if(this.seatAfterSelection === undefined) {
      // this.seatAfterSelection === undefined mean that user click save without any changes.
      this.seatId = this.seatIdBeforeSelection;
      this.occupantPopUpService.changeSelectionMode(false);
    }
    //if changed to same seat - do nothing
    else if(previousSeat._id === this.seatAfterSelection._id) {
      this.seatId = this.seatIdBeforeSelection;
      this.occupantPopUpService.changeSelectionMode(false);
      this.seatAfterSelection._id = previousSeat._id;
    }
    //if chosen seat is empty - clear this, set on chosen.
    else if(previousSeat._id !== this.seatAfterSelection._id && this.seatAfterSelection.Status === 'Free') {
      this.seatToFreePlace(previousSeat, emptyUser);
    } 
    //if chosen seat is not empty - ask 'swap or just change current'
    else if (previousSeat._id !== this.seatAfterSelection._id && this.seatAfterSelection.Status === 'Occupied'){
      if(confirm(`Swap seats between ${previousSeat.UserId} and ${this.seatAfterSelection.UserId} ?`)) {
        this.swapSeats(previousSeat, emptyUser); 
      } else {
        if(confirm(`Seat ${previousSeat.UserId} on the ${this.seatAfterSelection.UserId} place ?
          ${this.seatAfterSelection.UserId} will be without seat!`)) {
          this.seatToOccupiedPlace(previousSeat, emptyUser);
        } else {
          this.seatId = this.seatIdBeforeSelection;
          this.occupantPopUpService.changeSelectionMode(false);
        }
      }
    }

    this.ref.detectChanges();
  }

  seatToFreePlace(previousSeat, emptyUser){
    if(confirm(`Change seat for ${this.name + this.lastName} from ${previousSeat.Title} to ${this.seatAfterSelection.Title} ?`)) {
      //seatPopUp now show new seat
      this.seatPopUpService.setCurrentSeat(this.seatAfterSelection);
      //clean previous
      this.serverService.updateSeat(previousSeat.Title, emptyUser, previousSeat);
      //fill current
      this.serverService.updateSeat(this.seatAfterSelection.Title, this.currentOccupant, this.seatAfterSelection);
      //updateUser SeatId
      this.serverService.seatUser(this.currentOccupant._id, this.seatAfterSelection.Title);
      //close selection mode
      this.occupantPopUpService.changeSelectionMode(false);
    } else {
      this.seatId = this.seatIdBeforeSelection;
      this.occupantPopUpService.changeSelectionMode(false);
      this.seatAfterSelection._id = previousSeat._id;
    }
  }

  swapSeats(previousSeat, emptyUser){
    //get another user for swap 
    this.serverService.getCurrentUser(this.seatAfterSelection.UserId).then(res => {
      let anotherUser = JSON.parse(res["_body"])[0];
      console.log(anotherUser);
      //seat current occupant on another place
      this.serverService.updateSeat(this.seatAfterSelection.Title, this.currentOccupant, this.seatAfterSelection);
      //seat another occupant on our previous place
      this.serverService.updateSeat(previousSeat.Title, anotherUser, previousSeat);
      //update our User seatId
      this.serverService.seatUser(this.currentOccupant._id, this.seatAfterSelection.Title);
      //update another User seatId
      this.serverService.seatUser(anotherUser._id, previousSeat.Title);
      //close selection mode
      this.occupantPopUpService.changeSelectionMode(false);
      //seatPopUp now show new seat
      this.seatPopUpService.setCurrentSeat(this.seatAfterSelection);
    });
  }

  seatToOccupiedPlace(previousSeat, emptyUser){
    //get another user for clear his seat
    this.serverService.getCurrentUser(this.seatAfterSelection.UserId).then(res => {
      let anotherUser = JSON.parse(res["_body"])[0];
      //seat current occupant on another place
      this.serverService.updateSeat(this.seatAfterSelection.Title, this.currentOccupant, this.seatAfterSelection);
      //clear another occupant from place where we gonna seat
      this.serverService.updateSeat(previousSeat.Title, emptyUser, previousSeat);
      //update our User seatId
      this.serverService.seatUser(this.currentOccupant._id, this.seatAfterSelection.Title);
      //update another User seatId
      this.serverService.seatUser(anotherUser._id, 'Free');
      //close selection mode
      this.occupantPopUpService.changeSelectionMode(false);
      //seatPopUp now show new seat
      this.seatPopUpService.setCurrentSeat(this.seatAfterSelection);
    });
  }

}
