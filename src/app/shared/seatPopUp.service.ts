import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';


@Injectable() 
export class SeatPopUpService {

  selectedSeat: any;

  // Observable source
  private visibilityDataSource = new Subject<boolean>();

  constructor(private http: Http) {
    this.selectedSeat;
  }

  // Observable stream
  visible$ = this.visibilityDataSource.asObservable();


  changeVisibility(newState: boolean) {
    this.visibilityDataSource.next(newState);
  }

}