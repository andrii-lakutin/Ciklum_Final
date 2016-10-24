export class Seat {

  Title : string;
  Status: string;
  UserId: string;
  SeatId: string; // Will come from DB
  X: number;
  Y: number;
  _method: string;

  constructor() { 
  	this.Title  = "No Title";
    this.Status = "Free";
    this.UserId = "Free";
    this.X = 480;
    this.Y = 240;
    this._method = "Create";
  }	
}