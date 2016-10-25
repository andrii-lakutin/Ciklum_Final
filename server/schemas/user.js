//This is schema for users, who use our app.
import mongoose from 'mongoose';

var userSchema = mongoose.Schema({
	Name: String,
	Pass: String
});

var User = mongoose.model('User', userSchema);

export default User