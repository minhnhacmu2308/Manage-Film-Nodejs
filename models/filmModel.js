var mongoose = require('mongoose');
var film = new mongoose.Schema({
    Name:String, 
    Image:String, 
    Level:Number,
    Description:String, 
})
module.exports=mongoose.model('film',film);