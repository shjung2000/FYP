const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const User = new Schema({
    email: {type: String , required: true},
    name: {type: String , required: true},
    phone: {type: String , required: true},
    pax: {type: Number , required: true},
    date_of_visit: {type: String , required: true},
    time: {type: String , required: true},
    tableID : {type: Array , required: true},
    status: {type: Number , required: true}
});


module.exports = mongoose.model('User' , User);

