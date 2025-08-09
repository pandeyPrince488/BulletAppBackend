const mongoose = require('mongoose');

let data = new mongoose.Schema({
    bname:String,
    mileage:Number,
    description:String,
    price:Number,
    attachment:String,
})

module.exports = mongoose.model('bikeAdd',data)
