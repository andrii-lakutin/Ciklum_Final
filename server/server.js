import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import crypto from 'crypto';

import db from './db.js';
import User from "./schemas/user";
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

  let seatId;

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});