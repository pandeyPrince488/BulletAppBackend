const mongoose = require('mongoose');

let data = new mongoose.Schema({
    id:Number,
    yname:String,
    mobile:Number,
    password:Number,
})

module.exports = mongoose.model('aRegister',data)