import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';

@Injectable() 
export class SeatPopUpService {

  currentSeat      : any;
  editing          : any;
  currentUser      : any; 
  titleEditing     : boolean;
  userEditing      : boolean;
  login            : boolean; 

  // Observable source
  private visibilityDataSource = new Subject<boolean>();
  private loginDataSource = new Subject<boolean>();
  private currentSeatDataSource = new Subject<any>();
  private editingDataSource = new Subject<any>();
  private occupantDataSource = new Subject<any>();

  constructor(private http: Http) {
    this.currentSeat;
    this.login = false;
    this.editing = {
      titleEditing : false,
      userEditing  : false
    }
    this.currentUser = {
      Name: 'Free',
      LastName: ''
    };
  }

  // Observable stream
  visible$ = this.visibilityDataSource.asObservable();
  login$ = this.loginDataSource.asObservable();
  seat$ = this.currentSeatDataSource.asObservable();
  editing$ = this.editingDataSource.asObservable();
  occupant$ = this.occupantDataSource.asObservable();


  changeVisibility(newState: boolean) {
    this.visibilityDataSource.next(newState);
  }

  setCurrentSeat(seat){
    if(seat._method === 'Create') {
      this.editing.titleEditing = true;
      this.editing.userEditing = true;
      this.editingDataSource.next(this.editing);
    } else {
      this.editing.titleEditing = false;
      this.editing.userEditing = false;
      this.editingDataSource.next(this.editing);
    }

    this.getCurrentUser(seat.UserId);

    this.currentSeat = seat;
    this.currentSeatDataSource.next(this.currentSeat);
  }

  getCurrentUser(fullName){
    this.http.get(`http://localhost:3000/getCurrentUser=${fullName}`)
      .toPromise()
      .then(res => {
        let user = JSON.parse(res["_body"]);
        this.currentUser = user[0];
        this.occupantDataSource.next(this.currentUser);
      });
  }

  setLogin(newState: boolean){
    this.login = newState;
    this.loginDataSource.next(this.login);
  }

  checkIsLogin(){
    return this.login;
  }

  titleEdit(newState: boolean){
    this.editing.titleEditing = newState;
    this.editingDataSource.next(this.editing);
  }

  userEdit(newState: boolean){
    this.editing.userEditing = newState;
    this.editingDataSource.next(this.editing);
  }

  getCurrentSeat(){
    return this.currentSeat;
  }

}