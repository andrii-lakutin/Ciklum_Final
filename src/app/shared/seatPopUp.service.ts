import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';


@Injectable() 
export class SeatPopUpService {
  isNewSeat : boolean;

  // Observable string source
  private visibilityDataSource = new Subject<boolean>();

  constructor(private http: Http) {
    this.isNewSeat = false;
  }

  // Observable string stream
  visible$ = this.visibilityDataSource.asObservable();


  changeVisibility(newState: boolean) {
    this.visibilityDataSource.next(newState);
  }

}