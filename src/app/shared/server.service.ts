import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Seat } from '../shared/seat';
import { SeatPopUpService } from './seatPopUp.service';
import { OccupantPopUpService } from './occupantPopUp.service';

import 'rxjs/add/operator/toPromise';

import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';

@Injectable() 
export class ServerService {

  seats: any;
  users: any;

  private seatsDataSource = new Subject<any>();
  private usersDataSource = new Subject<any>();

  constructor(private http: Http,
   private seatPopUpService: SeatPopUpService,
   private occupantPopUpService: OccupantPopUpService ) {
    this.seats = [];
    this.users = {
      whoAsk: '',
      data: []
    };
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
    return this.http.get(`http://localhost:3000/getAllSeats`)
      .toPromise()
      .then(res => {
        let arrOfSeats = JSON.parse(res["_body"]);
        this.seats = arrOfSeats;
        console.log(arrOfSeats);
        this.seatsDataSource.next(this.seats);
      })
  }

  updateSeat(newTitle, newUser, exactSeat?){
    let seat = exactSeat || this.seatPopUpService.getCurrentSeat();
    seat.Title = newTitle;
    seat.UserId = newUser.Name +' '+ newUser.LastName;
    if(!newUser.LastName) {
      seat.Status = 'Free'
    } else {
      seat.Status = 'Occupied'
    }
    seat._method = 'Update';

    this.post('seat', seat)
      .then((res) => {
        this.seatPopUpService.titleEdit(false);
        this.seatPopUpService.userEdit(false);
        this.getAllSeats();
      })
  }

  deleteSeat(id){
    let data = {
      id: id
    };

    return this.post('deleteSeat', data)
      .then((res)=>{
        this.getAllSeats();
      })
  }

  seatUser(userId, seatTitle, seat?){
    let data = {
      userId: userId,
      seatId: seatTitle
    };

    return this.post('seatUser', data)
    .then((res)=>{
      if(seat) {
        this.occupantPopUpService.chooseSeat(seat);
      }
    })
  }

  getCurrentUser(fullName){
    return this.http.get(`http://localhost:3000/getCurrentUser=${fullName}`)
      .toPromise()
  }

  getCurrentSeat(Id){
    return this.http.get(`http://localhost:3000/getCurrentSeat=${Id}`)
      .toPromise()
  }

  setNewCoords(seat, newCoords){
    let data = {
      seat : seat._id,
      X: newCoords.left,
      Y: newCoords.top
    };
    return this.post('newSeatCoords', data)
    .then((res) => {
        this.getAllSeats();
      })
  }

  clearPreviousSeat(userId, seatId){
    let data = {
      userId: userId,
      seatId: seatId
    };

    return this.post('clearSeat', data)
  }

  post(path, data){
    let url = `http://localhost:3000/${path}`;
    let body = JSON.stringify(data);
    let head = new Headers({'Content-Type': 'application/json'});

    return this.http.post(url, body, {headers: head})
      .toPromise()
  }

  search(searchValue, component){
    this.http.get(`http://localhost:3000/search=${searchValue}`)
      .toPromise()
      .then(res => {
        let arrOfUsers = JSON.parse(res["_body"]);
        console.log(arrOfUsers);
        this.users.whoAsk = component;
        this.users.data = arrOfUsers;
        this.usersDataSource.next(this.users);
      });
  }

  getCurrentSeatByTitle(Title){
    return this.http.get(`http://localhost:3000/getCurrentSeatByTitle=${Title}`)
      .toPromise()
  }

  onEmptySearch(){
    let empty = {
      whoAsk : 'any',
      data : []
    }
    this.usersDataSource.next(empty);
  }

}