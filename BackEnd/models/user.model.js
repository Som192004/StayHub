const mongoose = require('mongoose') ;

const userSchema = new mongoose.Schema({
    name : String ,
    email : {type : String ,
        unique : true} ,
    password : String ,
    likedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'place' }],

}) ;

const usermodel = mongoose.model('User' , userSchema);

module.exports = usermodel ;