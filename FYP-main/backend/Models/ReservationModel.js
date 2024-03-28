const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Reservation = new Schema({
    date_of_visit: {type: String , required: true},
    time: {type: String , required:true},
    tableID: {type: Array , required: true},
});



module.exports = mongoose.model('Reservation' , Reservation);


