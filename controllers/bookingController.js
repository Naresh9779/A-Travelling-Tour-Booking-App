const stripe=require('stripe')('sk_test_51Op2xvSDKsAVOdzPjbIrguHQ3b7jp5mKVD4TJfIvabEhe6yrQgshNNP0gwhdqUUgkYU0DTtsxX5CBAoEzQd2VNiD00t4O3O4ui')
const Tour=require('../models/tourModel');
const User=require('../models/userModel');
const factory=require('./handlerFactory');
const Booking=require('../models/bookingModel');
const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');
const { response } = require('express');

exports.getAllBookings=factory.getAll(Booking);
  
 
  exports.createBooking=factory.createOne(Booking);
  exports.updateBooking=factory.updateOne(Booking);
  exports.deleteBooking=factory.deleteOne(Booking);
  exports.getBookings=factory.getOne(Booking);



exports.getCheckOutSession=catchAsync(async(req,res,next)=>
{
    // console.log(req.params.tourId);
    const tour=await Tour.findById(req.params.tourId)
   
    const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:'payment',
        customer_email:req.user.email,
        
        client_reference_id:req.params.tourId,
        success_url:`${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

        line_items:[
            {
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:tour.name,
                        description:tour.summary,
                        // images:''

                    },
                    unit_amount:tour.price*100
                },
                quantity:1
                    
                },
             
            
            
        ]
    })
    res.status(200).json({
        status:'success',
        data:{
            session
        }
    })

})

exports.createBooking=catchAsync(async(req, res, next)=>{
    const {tour,user,price}=req.query;

if(!user&&!tour&&!price)
{
    return next();
}

await Booking.create({tour,user,price});
res.redirect(req.originalUrl.split('?')[0]);
})
