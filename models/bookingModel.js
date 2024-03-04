const mongoose = require('mongoose')
const User=require('./userModel');

const bookingSchema=new mongoose.Schema({
    tour:{
        type: mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Booking Must Have Tour'],
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Booking Must Have User'],
    },
    createdAt:{
        type:Date,
        default:Date.now(),

    },
    price:{
        type:Number,
        required:[true,'Booking Must Have Price']

    },
    paid:{
        type:Boolean,
        default:true,
    }

});

bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'tour',
        select:'name price',
    })
    next();

})

const Bookings=mongoose.model('Booking',bookingSchema);

module.exports=Bookings;