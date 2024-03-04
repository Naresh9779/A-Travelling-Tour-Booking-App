const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory=require("./handlerFactory");
const multer=require('multer');
const sharp=require('sharp');


exports.createTour=factory.createOne(Tour);

exports.updateTour=factory.updateOne(Tour);

exports.deleteTour=factory.deleteOne(Tour);

exports.getTour=factory.getOne(Tour,{path:'reviews'});


exports.getAllTour=factory.getAll(Tour);


exports.getToursDistance=catchAsync(async(req,res,next)=>{
    const {latlng,unit}=req.params;
const [lat,lang]=latlng.split(',');
const multiplier=unit==='mi'?0.000621371:0.001;
if(!lang||!lat)
{
return next(new AppError('Enter The Valid Location In Form Of [Lang,Lat] '));
}
const distances=await Tour.aggregate([
   { $geoNear:{
      near: { type:'Point',
        coordinates:[lang*1,lat*1]

    },
    distanceField:'distance',
    distanceMultiplier:multiplier


}},
{$project:{
    name:1,
    distance:1
}}])

res.status(200).json({
    status: 'success',

    data:{
        data:distances
    }

})
}
)


exports.getToursWithin=catchAsync(async (req,res,next)=>{
const {distance,latlng,unit}=req.params;
// console.log(latlng);
const [lat,lang]=latlng.split(',');
const radius=unit==='mi'?distance/3963.2:distance/6378.1;
if(!lang||!lat)
{
return next(new AppError('Enter The Valid Location In Form Of [Lang,Lat] '));
}

const tours= await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lang,lat],radius]}}
});
res.status(200).json({
    status: 'success',
    result:tours.length,
    data:{
        data:tours
    }

})

});


exports.getTourReviews=catchAsync(async(req,res,next) => {
    
 
  
 const review= await Tour.findById(req.params.tourId).populate('reviews');
 res.status(200).json({
    status:"success",
    totalReviews:review.ratingsQuantity,
    avgRating:review.ratingsAverage,
data:{
    data :review.reviews,
}
});
 
    
});


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
  
exports.uploadTourImages=upload.fields([{
    name:'images',maxCount:3},
   { name:'imageCover',maxCount:1
  }])
exports.resizeTourImages=catchAsync(async(req,res,next) => {
    if(!req.files.images||!req.files.imageCover) return next();
// !) Image Cover
req.body.imageCover=`tour-${req.params.id}-${Date.now()}-cover.jpeg`;

console.log(req.body.imageCover)
   await sharp(req.files.imageCover[0].buffer).resize(2000,1333).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/tours/${req.body.imageCover}`);

   req.body.images=[];
   await Promise.all(
   req.files.images.map(async(file,i) => {
    
 const filename=`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`;
   await sharp(file.buffer).resize(2000,1333).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/tours/${filename}`);
   req.body.images.push(filename);
   
   })
   );
   
   next();

})

exports.aliasTopTour=(req,res,next)=>{
req.query.limit='5';
req.query.sort='-ratingsAverage,-price';
req.query.fields='name,price,ratingsAverage,summary,difficulty,';
next();
};











exports.tourStats=catchAsync(async (req,res)=>{
   
const stats= await Tour.aggregate(
[
    {
        $match:{ratingsAverage:{$gte:4.5}}
},
{
    $group:{
    _id:{$toUpper:'$difficulty'},
    numTours:{$sum :1},
    avgRating:{$avg:'$ratingsAverage'},
    avgPrice:{$avg:'$price'},
    minPrice:{$min:'$price'},
    maxPrice:{$max:'$price'}




}
},
{
    $sort:{avgPrice:-1}
}
]);
res.status(200).json({
    status:"success",
data:{
    tour:stats
}
});

    
});
exports.getMonthlyPlan=catchAsync(async(req,res)=>{

   
        
        const year= req.params.year*1;

        const plan= await Tour.aggregate([
            {
                $unwind:'$startDates',

            },
        {
            $match:{
                startDates:{
                    $gte:new Date(`${year}-01-01`),
                    $lte:new Date(`${year}-12-31`)}}
    },
    {
        $group:{
            _id:{$month:'$startDates'},
            name:{$push:'$name'},
            numTours:{$sum:1},


        }
    },
    {
        $addFields:{month:'$_id'}
    },
    {
        $project:{
            _id:0
        }
    },
    {
        $sort:{numTours:-1}
    }
        ]);
       






      res.status(200).json({
          status:"success",
      data:{
        tour:plan
      }
      });
 

});
