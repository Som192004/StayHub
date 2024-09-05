const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    bookingplace : {
        type : mongoose.Schema.Types.ObjectId ,
        required : true ,
        ref : 'place' ,
        
    } ,
    checkIn : {
        type : Date ,
        required : true ,
    },
    
    checkOut : {
        type : Date ,
        required : true ,
    } ,
    nameOfGuest : {type : String , required : true} ,

    phoneNum : {
        type : String ,
        required : true ,
    },
    price : Number ,
    numberOfGuests : Number ,
    user : {type : mongoose.Schema.Types.ObjectId , required : true} 

});

const bookingModel = mongoose.model('Booking' , bookingSchema);

module.exports = bookingModel ;
