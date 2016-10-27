import { Injectable, Inject } from '@angular/core';

import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';

@Injectable()  
export class OccupantPopUpService {

  currentOccupant: any;
  selectionMode : boolean;
  seat: any;

  private currentOccupantDataSource = new Subject<any>();
  private visibilityDataSource = new Subject<boolean>();
  private selectionModeDataSource = new Subject<boolean>();
  private seatDataSource = new Subject<any>();

  constructor() {
    this.currentOccupant;
    this.selectionMode = false;
    this.seat;
  }

  occupant$ = this.currentOccupantDataSource.asObservable();
  visible$ = this.visibilityDataSource.asObservable();
  selectionMode$ = this.selectionModeDataSource.asObservable();
  seat$ = this.seatDataSource.asObservable();

  setCurrent(occupant){
    this.currentOccupant = occupant;
    this.currentOccupantDataSource.next(this.currentOccupant);
  }

  changeVisibility(newState: boolean) {
    this.visibilityDataSource.next(newState);
  }

  chooseSeat(seat){
    this.seat = seat;
    this.seatDataSource.next(this.seat);
  }

  getCurrentSeat(){
    return this.seat;
  }

  changeSelectionMode(newState: boolean){
    this.selectionMode = newState;
    this.selectionModeDataSource.next(this.selectionMode);
  }

}