const mongoose = require('mongoose');

let data = new mongoose.Schema({
    cname:String,
    cemail:String,
    service:String,
    mobile:Number,
    detail:String,
})

module.exports = mongoose.model('booking',data)