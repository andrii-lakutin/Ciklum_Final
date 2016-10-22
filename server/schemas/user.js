import mongoose from 'mongoose';

var userSchema = mongoose.Schema({
	Name: String,
	Pass: String
});

var User = mongoose.model('User', userSchema);

export default User