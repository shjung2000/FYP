const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Attendance = new Schema({
    name: {type: String , required: true},
    work_duration: {type: Number , required: true},
    date: {type: String , required: true},
    status: {type: String , required: true},
});



module.exports = mongoose.model('Attendance' , Attendance);