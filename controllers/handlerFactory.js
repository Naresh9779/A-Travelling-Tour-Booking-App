const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");











exports.createOne=Model=>catchAsync(async(req,res)=>{
    
    const doc=await Model.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            doc,
        }

    });

});


exports.deleteOne=Model=>catchAsync(async(req,res,next)=>{
   
    const doc= await Model.findByIdAndDelete(req.params.id);
    if (!doc) {

        return next(new AppError( 'No doc found ',404));
       }
  res.status(204).json({
      status:"success",
  data:null
  });

});

exports.updateOne=Model=>catchAsync(async(req,res,next)=>{
    
    const doc= await Model.findByIdAndUpdate(req.params.id,req.body,{
          new:true,
          runValidators:true
      });
      if (!doc) {

          return next(new AppError( 'No doc found ',404));
         }
  res.status(200).json({
      status:"success",
  data:{
      doc
  }
  });

});
exports.getOne=(Model,popOptions)=>catchAsync(async(req,res,next)=>{

let query=Model.findById(req.params.id);
if(popOptions) query.populate(popOptions);
const doc =await query
if(!doc){
    return next(new AppError( 'No Document found ',404));
}

res.status(200).json({
status: "success",
data:{
    data:doc
}
})
});

exports.getAll=Model=>catchAsync(async(req,res)=>{
   


    // eXecute Query
     const features = new APIFeatures(Model.find(),req.query)
     .filter()
     .sort()
     .fieldLimiting()
     .pagination();
    const doc= await features.query;

  
    res.status(200).json({
        status:"success",
        results: doc.length,
        data:{
            data:doc
        }

    });

});
