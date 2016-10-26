import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import crypto from 'crypto';

import db from './db.js';
import User from "./schemas/user";
import PotentialOccupant from "./schemas/users";
import Seat from "./schemas/seat";


var app = express();

// create application/json parser 
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
  next();
}); 

app.post('/login', jsonParser, function (req, res) {

	const name = req.body.name;
	const pass = req.body.pass;

	let hash = crypto.createHash('md5').update(pass).digest('hex');

    User.find({Name: name}).exec(function(err, data){
    	if (err) {
    		console.log(err);
    		res.status(500).send('Server problem');
    	} else {
    		if (!data.length) {
    			res.status(401).send('Wrong user name!');
    		} else{
    			hash === data[0].Pass ? res.status(200).send('Access allowed') : res.status(401).send('Wrong password!');
    		}
    	}
    });
});

app.post('/seat', jsonParser, function (req, res) {

  console.log(req.body);

  const method = req.body._method; // Create/Update
  const title = req.body.Title;
  const status = req.body.Status;
  const userId = req.body.UserId; 
  const x = req.body.X;
  const y = req.body.Y;

  let seatId = req.body.SeatId || req.body._id;

  if (method === 'Create') {
    let seat = new Seat({
      Title : title,
      Status: status,
      UserId: userId,
      X : x,
      Y : y
    });

    seat.save(function (err, test) {
      if (err) return console.error(err);
      let seatId = test._id;

      res.status(200).send(seatId);
    });
  }

  if (method === 'Update') {
    Seat.update({ _id:seatId}, 
      {$set: 
        {Title: title,
          Status : status,
          UserId : userId,
          X : x, 
          Y : y
        }
      },
      function(err, data){
        if (err) {
          console.log(err);
        } else {
          res.status(200).send(data);
        }
      });
  }
});

app.get('/getAllSeats', function(req,res){
  Seat.find().exec(function(err, data){
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(data);
      }
    });
});

// app.post('/createUser', jsonParser, function(req,res){
//   let potentialOccupant = new PotentialOccupant({
//     Name    : req.body.Name,
//     LastName: req.body.LastName,
//     Mail    : req.body.Mail,
//     SeatId  : req.body.SeatId
//   });

//   potentialOccupant.save(function (err, test) {
//     if (err) return console.error(err);

//     res.status(200).send('Added!');
//   });
// });

app.get('/search=:searchValue', function(req,res){
  let search = req.params.searchValue;
  console.log(req.params.searchValue);
  let re = new RegExp(search, 'i');
  PotentialOccupant.find({ $or: [ { Name: re }, { LastName: re } , { Mail : re} ] }).exec(function(err,data){
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(data);
      }
  });
});

app.get('/getCurrentUser=:fullName', function(req,res){
  let fullName = req.params.fullName;
  let data = fullName.split(' ');
  PotentialOccupant.find({ $and: [ { Name: data[0] }, { LastName: data[1] } ] }).exec(function(err,data){
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(data);
      }
  });
});

app.post('/seatUser', jsonParser, function(req,res){
  const userId = req.body.userId;
  const seatId = req.body.seatId;

  PotentialOccupant.update({ _id:userId}, 
    {$set: 
      {
        SeatId : seatId
      }
    },
    function(err, data){
      if (err) {
        console.log(err);
      } else {
        res.status(200).send('Success!');
      }
    });
});

app.post('/clearSeat', jsonParser, function(req,res){
  const userId = req.body.userId;
  const seatId = req.body.seatId;

  Seat.update({ UserId : userId}, 
    {$set: 
      {
        UserId : 'Free',
        Status : 'Free'
      }
    },
    function(err, data){
      if (err) {
        console.log(err);
      } else {
        res.status(200).send('Success!');
      }
  });
});

app.post('/newSeatCoords', jsonParser, function(req,res){

  console.log(req.body);

  const seat = req.body.seat;
  const X = req.body.X;
  const Y = req.body.Y;

  Seat.update({ _id : seat}, 
    {$set: 
      {
        X : X,
        Y : Y
      }
    },
    function(err, data){
      if (err) {
        console.log(err);
      } else {
        res.status(200).send('Success!');
      }
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});