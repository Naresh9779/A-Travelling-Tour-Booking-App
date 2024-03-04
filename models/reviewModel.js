const mongoose = require('mongoose');
const Tour=require('./tourModel');
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review Can Not Be Empty'],
  },
  rating: {
    type: Number,
    required: [true, 'Please Select From 1 to 5'],
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: { type: mongoose.Schema.ObjectId, ref: 'Tour' },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
},{
  toJSON:{virtuals:true},
 toObj:{virtuals:true} 
});
reviewSchema.pre(/^find/,function(next)
{
//   this.populate({
//     path:'user',
//     select:'name photo  '
// }).populate({
//   path:'tour',
//   select:'name '
// });
this.populate({
path:'user',
select:'name photo '
});
  next();

});

reviewSchema.index({tour:1,user:1},{
  unique:true,
  index:true,
});
reviewSchema.statics.calcAverageRatings=async function(tourId)
{
  const stats= await this.aggregate([{
    $match:{
      tour:tourId
    }
   },{
    $group:{
      _id:'$tour',
      nRatings:{$sum:1},
      avgRating:{$avg:'$rating'}
 }
}]);
if (stats.length > 0)
(await Tour.findByIdAndUpdate(tourId,{
  ratingsAverage:stats[0].avgRating,
  ratingsQuantity:stats[0].nRatings

}))
else {
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: 0,
    ratingsAverage: 4.5,
  });
}
};
reviewSchema.post('save',function()
{
   
this.constructor.calcAverageRatings(this.tour);

});

//deleteAnd Update

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) await doc.constructor.calcAverageRatings(doc.tour);
});


const Review= mongoose.model('Review',reviewSchema);
module.exports =Review;