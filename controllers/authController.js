const {promisify}=require('util');
const  User=require('../models/userModel');
const catchAsync=require('../utils/catchAsync');
const jwt=require('jsonwebtoken');
const Email=require('../utils/email');
const crypto=require('crypto');

const AppError=require('../utils/appError');
const { ReturnDocument } = require('mongodb');

const signToken=id =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createAndSendToken=(user,statusCode,res)=>{
    const token=signToken(user._id);
    cookieOptions={
        expires:new Date(Date.now()+process.env.COOKIE_JWT_EXPIRES_IN*24*60*60*100 ),
        httpOnly:true,
    }
    if(process.env.NODE_ENV==='production') cookieOptions.secure=true;
    res.cookie('jwt',token,cookieOptions);
    user.password=undefined;
    
   
    res.status(statusCode).json(
    {
     status: 'success',
     token,
     user

    } );
}
exports.signUp=catchAsync(async(req,res,next)=>{
const newUser = await User.create(req.body);
const url=`${req.protocol}://${req.get('host')}/me`;
await new Email(newUser,url).sendWelcome();

createAndSendToken(newUser,201,res);



});
exports.login=catchAsync(async(req,res,next) => {
    const {email,password} = req.body;
    // check email Password exist
    if(!email || !password)
    {
       return next(new AppError('Please Provide Email And Password ',400));

    }
    //if user exist && password correct
    const user=await User.findOne({email}).select('+password');


    if(!user||!(await user.correctPassword(password,user.password)))
    {
        return next(new AppError('Incorrect Password Or Email',400));
    }
       // send token   
       createAndSendToken(user,200,res);

});

exports.logout=(req,res,next)=>{
    res.cookie('jwt','LoggedOut',{
        expires:new Date(Date.now()*1000),
        httpOnly:true,

    });
  
    
   
    res.status(200).json(
    {
     status: 'success',

    } );
}

exports.LoggedIn =async(req,res,next) => {
   
    // Get Token And Check Of it There
      if(req.cookies.jwt)
  try{
    {

    // Token Validation
  const decoded= await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);

    //Check User Exist 
    const currentUser=await User.findById(decoded.id);
    if(!currentUser)
    {
        return next();
    }

    //check if user changed password after token
    if (currentUser.changedPasswordAfter(decoded.iat)
    ){
return next();

    };
    

    
    res.locals.user=currentUser;
    return next();
}}catch(error)
{
    return next();
}

    next();
};












exports.protect =catchAsync(async(req,res,next) => {
    let token;
    // Get Token And Check Of it There

    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];

    }
    else if(req.cookies.jwt)
    {
        token=req.cookies.jwt;
    }
    
    if(!token){
        return next(
            new AppError('You Are Not Logged In',401)
        );
    }

    // Token Validation
  const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    //Check User Exist 
    const currentUser=await User.findById(decoded.id);
    if(!currentUser)
    {
        return next(new AppError('This Token No Longer Exist',401));
    }

    //check if user changed password after token
    if (currentUser.changedPasswordAfter(decoded.iat)
    ){
return next(new AppError(' User changed password ',401));

    };
    

    //grant toprotected
    req.user=currentUser;
    res.locals.user=currentUser;

    next();
});
exports.restrictTo=(...roles)=>{
    return (req,res,next) => {
        if(!roles.includes(req.user.role))
        {
            return next(new AppError('Do not Have Acess',403));
        }
      next();
    }

};
exports.forgotPassword=catchAsync(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user) {
        return next(new AppError('Email Not Found',404));
    }
    const resetToken=user.createPasswordResetToken();

    await user.save({validateBeforeSave:false});
   
   

 try{// await sendEmail({
//         email : user.email,
//         subject: 'Link Will Expire In 10 Min',
//         message
    //});

    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user,resetURL).sendReset();
    res.status(200).json({
        status:"success",
        message:'Reset Link Sent Sucessfully'
    
       });
}catch(err)
    {
        console.log(err);
        user.passwordResetToken=undefined,
       user.resetTokenExpires=undefined
       await user.save({validateBeforeSave:false});
       return next(new AppError('Email Not Sent Try Again',500));
    }

 

});
exports.resetPassword=catchAsync(async(req,res,next)=>
{
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(hashedToken);
  const user =await User.findOne({
    passwordResetToken:hashedToken,
    resetTokenExpires:{$gt:Date.now()}
  });
  if(!user)
  {
    return next(new AppError(' Link Expired Or Invalid ! Please Try Again',401));
  }

user.password=req.body.password;
user.passwordConfirm=req.body.passwordConfirm;
user.passwordResetToken=undefined;
user.resetTokenExpires=undefined;
await user.save();

createAndSendToken(user,200,res);






});

exports.updatePassword=catchAsync(async(req,res,next) => {

 const user= await User.findById(req.user.id).select('+password');

 
 if(!(await user.correctPassword(req.body.passwordCurrent,user.password)))
 {
 return next(new AppError('Invalid Password Try Agin',401));
 }
 
 

 user.password = req.body.password;
 user.passwordConfirm=req.body.passwordConfirm;
 await user.save();



 createAndSendToken(user,200,res);



});