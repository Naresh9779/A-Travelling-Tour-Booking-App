const Tour=require('../models/tourModel');
const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');
const Booking=require('../models/bookingModel');


// app.get('/',(req, res) => {
//     res.status(200).render('base');
//   })
  exports.getOverview=catchAsync(async(req, res,next) => {
    const tours=await Tour.find();
   
    res.status(200).render('overview',{
      title:'All Tours',
     tours
    })
  });
  exports.getTour=catchAsync(async(req, res,next) => {
       const tour=await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields:'review rating user'
       });

       if(!tour)
       {
        return next(new AppError('No Tour Found !!',404));
       }
      //  console.log(tour);
    res.status(200).render('tour',
    {
      title:tour.name,
      tour
    })
  })
  
  exports.LoginForm=(req,res) => {
       res.status(200).render('login',
       {
        title:"Login",
       })


  }

  exports.SignupForm=(req,res) => {
    res.status(200).render('signup',
    {
       title:"Signup",
    })
  }
  exports.accountForm=(req,res) => {
  

    res.status(200).render('account',{
      title:"Account",
    });
  }
  exports.bookedTours=catchAsync(async(req, res,next)=>{

    // Finding User
      const bookUser=await Booking.find({user:req.user.id});
      const tourIds=bookUser.map(el=>el.tour)
      const tours=await Tour.find({_id:{$in:tourIds}});

      res.status(200).render('overview',{
        title:'Booked Tours',
       tours
      });
  });