const express = require('express');
const tourController = require('../controllers/tourController');
const authcontroller = require('../controllers/authController');
const bookingcontroller = require('../controllers/bookingController');
const reviewRouter=require('../routes/reviewRoutes');
const router=express.Router();


router
.route('/toursDistance/:latlng/unit/:unit')
.get(tourController.getToursDistance)


router
.route('/toursWithin/:distance/center/:latlng/unit/:unit')
.get(tourController.getToursWithin)
router.use('/:tourId/createReview', reviewRouter);
router.
route('/getReviews/:tourId').get( tourController.getTourReviews);
router
.route('/top-5-cheap')
.get(tourController.aliasTopTour,tourController.getAllTour);

router
.route('/tour-stats')
.get(tourController.tourStats);
router
.route('/monthly-plan/:year')
.get(authcontroller.protect,authcontroller.restrictTo('admin','guide','lead-guide'),tourController.getMonthlyPlan);
router
.route('/')
 .post(authcontroller.protect,tourController.uploadTourImages,tourController.resizeTourImages,authcontroller.restrictTo('admin','guide','lead-guide'),tourController.createTour);



 router
.route('/')
.get(tourController.getAllTour)
router
.route('/:id')
.get(tourController.getTour)
.patch(authcontroller.protect,authcontroller.restrictTo('admin','lead'),tourController.uploadTourImages,tourController.resizeTourImages,tourController.updateTour)
.delete(authcontroller.protect,authcontroller.restrictTo('admin','lead'),tourController.deleteTour);



//  Nested Routes



module.exports = router;