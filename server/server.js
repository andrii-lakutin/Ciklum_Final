import express from 'express';
import db from './db.js';
import http from 'http';
import User from "./schemas/user";
import bodyParser from 'body-parser';
import crypto from 'crypto';

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});