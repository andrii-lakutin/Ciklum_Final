import mongoose from 'mongoose';

var seatSchema = mongoose.Schema({
	Title : String,
	Status: String,
	UserId: String,
	X : Number,
	Y : Number
});

var Seat = mongoose.model('Seat', seatSchema);

export default Seat