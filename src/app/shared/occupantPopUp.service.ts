import { Injectable, Inject } from '@angular/core';

import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';

@Injectable() 
export class OccupantPopUpService {

  currentOccupant: any;

  private currentOccupantDataSource = new Subject<any>();
  private visibilityDataSource = new Subject<boolean>();

  constructor() {
    this.currentOccupant;
  }

  occupant$ = this.currentOccupantDataSource.asObservable();
  visible$ = this.visibilityDataSource.asObservable();

  setCurrent(occupant){
    this.currentOccupant = occupant;
    this.currentOccupantDataSource.next(this.currentOccupant);
  }

  changeVisibility(newState: boolean) {
    this.visibilityDataSource.next(newState);
  }
}