//This is schema for potential occupants (users that will be shown in search).
import mongoose from 'mongoose';

var PotentialOccupantSchema = mongoose.Schema({
	Name    : String,
	LastName: String,
	Mail    : String,
	SeatId  : String
});

var PotentialOccupant = mongoose.model('potentialOccupant', PotentialOccupantSchema);

export default PotentialOccupant

