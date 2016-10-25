import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Seat } from '../shared/seat';
import { SeatPopUpService } from './seatPopUp.service';

import 'rxjs/add/operator/toPromise';

import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';

@Injectable() 
export class ServerService {

  seats: any;
  users: any;

  private seatsDataSource = new Subject<any>();
  private usersDataSource = new Subject<any>();

  constructor(private http: Http, private seatPopUpService: SeatPopUpService ) {
    this.seats = [];
    this.users = [];
  }

  seats$ = this.seatsDataSource.asObservable();
  users$ = this.usersDataSource.asObservable();

  loginUser(name,pass) {
    let data = {
      name: name,
      pass: pass
    };

    return this.post('login', data)
  }

  createNewSeat(){
    let seat = new Seat();

    this.post('seat', seat)
      .then((res) => {
        seat.SeatId = res["_body"].slice(0, -1).slice(1);
        this.seats.push(seat);
        this.seatsDataSource.next(this.seats);
        this.seatPopUpService.setCurrentSeat(seat);
      })
  }

  getAllSeats(){
    this.http.get(`http://localhost:3000/getAllSeats`)
      .toPromise()
      .then(res => {
        let arrOfSeats = JSON.parse(res["_body"]);
        this.seats = arrOfSeats;
        this.seatsDataSource.next(this.seats);
      });
  }

  // getAllUsers(){
  //   this.http.get(`http://localhost:3000/getAllUsers`)
  //     .toPromise()
  //     .then(res => {
  //       let arrOfUsers = JSON.parse(res["_body"]);
  //       this.users = arrOfUsers;
  //       console.log(this.users);
  //     });
  // }

  updateSeat(newTitle, newUser){
    let seat = this.seatPopUpService.getCurrentSeat();
    seat.Title = newTitle;
    seat.UserId = newUser;
    seat._method = 'Update';
    console.log(seat);
    this.post('seat', seat)
      .then((res) => {
        this.seatPopUpService.titleEdit(false);
        this.seatPopUpService.userEdit(false);
        this.getAllSeats();
      })
  }

  post(path, data){
    let url = `http://localhost:3000/${path}`;
    let body = JSON.stringify(data);
    let head = new Headers({'Content-Type': 'application/json'});

    return this.http.post(url, body, {headers: head})
      .toPromise()
  }

  search(searchValue){
    this.http.get(`http://localhost:3000/search=${searchValue}`)
      .toPromise()
      .then(res => {
        let arrOfUsers = JSON.parse(res["_body"]);
        console.log(arrOfUsers);
        this.users = arrOfUsers;
        this.usersDataSource.next(this.users);
      });
  }

  onEmptySearch(){
    let empty = [];
    this.usersDataSource.next(empty);
  }

}