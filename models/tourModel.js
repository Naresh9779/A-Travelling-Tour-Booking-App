const mongoose = require('mongoose');
const slugify= require('slugify');
// const validator=require('validators');


const tourSchema= new mongoose.Schema({
name:{
    type:String,
    required:[true,'A tour Must Have A Name'],
   unique :[true,'A tour must have Unique Name'],
   maxlength:[40,'Name must have Length less than 40 characters'],
   minlength:[10,'Name must have Length greater  than 10 characters'],
//   validate:[validator.isAlpha,"Name Contain Only Alphabets"]
},
slug:String,


duration:{
    type:Number,
    required:[true,'A tour must have Duration'],

},
maxGroupSize :{
type:Number,
required:[true,'A tour must have Max Group Size'],

},
difficulty:{
    type:String,
    required:[true,'A tour must have Difficulty'],
    enum:{values:['easy', 'medium', 'difficult'],
    message:'A tour can Have Difficulty (easy,medium,difficult)'
}
},
price:{type:Number,
    required:[true,'A tour must have Price'],
},

priceDiscount:{type:Number,
validate:{
    validator:function(val){
 return val<this.price;

},
message: 'A tour must have PriceDiscount({VALUE}) less Than Price'
}
},
summary:{
    type:String,
 trim : true},
 description:{type:String,
    trim:true},

imageCover:{type:String,
 required:[true,'A tour must have Cover image']},

 images:[String],

 createdAt:{type:Date,
default:Date.now(),
select:false},

startDates:[Date],
secretTour:{
    type:Boolean,
    default:false
},
ratingsAverage:{
   type: Number,
   default:0,
   min:[1,'Rating must be between 1-5'],
   max:[5,'Rating must be between 1-5'],
   set:val=>{Math.round(val*10)/10}
    
},

ratingsQuantity:{
    type: Number,
  default:0,
}    
, startLocation:{
    type:{
        type:String,
        default:'Point',
        enum:['Point']
    },
    coordinates:[Number],
    address:String,
    description:String
 },
 locations:[
   { type:{
        type:String,
        default:'Point',
        enum:['Point']
    },
    coordinates:[Number],
    address:String,
    day:Number,
    description:String
}
 
],
guides:[{
    type:mongoose.Schema.ObjectId,
    ref:'User'
}],

},{
 toJSON:{virtuals:true},
 toObj:{virtuals:true} 
});
tourSchema.virtual('durationWeeks')
.get(function(){
    return this.duration/7;
});

//Virtual Populate

tourSchema.index({startLocation:'2dsphere'})
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'


});








//Document Middleware .save()and .create() functions
tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lowercase:true});
    next();
});

// tourSchema.post


// Query Midddle Ware 
tourSchema.pre(/^find/,function(next)
{
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
    })
    next();
});
tourSchema.pre(/^find/,function(next){
     this.find({secretTour:{$ne:true}});
     this.start=Date.now();


next();
});
tourSchema.post(/^find/,function(docs,next){
console.log(`Time Taken ${Date.now()-this.start}`);
// console.log(docs);
next();
});

// Aggeration Middleware

// tourSchema.pre('aggregate',function(next)
// {
//     this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
// console.log(this.pipeline());
// next();

// });

const Tour=mongoose.model('Tour',tourSchema);

module.exports=Tour; 