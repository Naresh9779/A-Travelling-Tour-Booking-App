
const catchAsync = require("../utils/catchAsync");
const User = require('../models/userModel');
const multer = require('multer');
const AppError = require("../utils/appError");
const factory=require('./handlerFactory');
const sharp=require('sharp')




exports.updateUser = factory.updateOne(User);
  exports.deleteUser =factory.deleteOne(User);
  exports.getUser = factory.getOne(User);
  exports.getAllusers=factory.getAll(User);
  exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
  }

// const multerStorage=multer.diskStorage({destination:(req,file,cb)=>
//   {cb(null,'public/img/users');

// },
// filename:(req,file,cb)=>{
//   const ext=file.mimetype.split('/')[1];
//   cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
// }
// });

const multerStorage=multer.memoryStorage();

const multerFilter=(req,file,cb) => {
if(file.mimetype.startsWith('image'))
{
  cb(null,true);
}
else{
  cb(new AppError('Invalid file!! Please Upload Image Only'),false);
}

}
const upload=multer({storage:multerStorage,
  fileFilter:multerFilter})
  
  exports.uploadUserPhoto=upload.single('photo')

exports.resizeUserPhoto=(req,res,next) => {

  
 
  if(!req.file)return next();
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;
 
  
     
  sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`);
  next();
}





const filteredObj=(obj,...allowedField)=>{
  const newObj={};
  Object.keys(obj).forEach(el => {
  if(allowedField.includes(el)) {newObj[el] = obj[el];}
    
  });
return newObj;
}


exports.deleteMe=catchAsync(async(req,res,next)=>
{
  const user= await User.findByIdAndUpdate(req.user.id,{active:false});

  res.status(204).json({
    status:"success",
    data:null

});
});

exports.updateMe=catchAsync(async(req, res, next)=>{
  //Error If Trying To Update Password

  if(req.body.password || req.body.passwordConfirm)
  {
    return next(new AppError("Cant Update Password",400));
  }
  const filteredBody=filteredObj(req.body,'name','email');
  if(req.file) filteredBody.photo=req.file.filename;
  const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true});
  res.status(200).json({
    status:"success",
    data:{
      user:updatedUser}
  });

  




});

  exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!/use/signup'
    });
  };
  
