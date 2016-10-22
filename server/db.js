import mongoose from 'mongoose';

var db = mongoose.connect('mongodb://Lucky:veryhardpassword@ds061196.mlab.com:61196/ciklum_final');

export default db