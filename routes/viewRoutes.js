const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router=express.Router();


router.get('/',bookingController.createBooking,authController.LoggedIn,viewController.getOverview);
router.get('/tour/:slug',authController.LoggedIn,viewController.getTour);
router.get('/login',authController.LoggedIn,viewController.LoginForm)
router.get('/signup',authController.LoggedIn,viewController.SignupForm)
router.get('/me',authController.protect,viewController.accountForm)
router.get('/my-bookings',authController.protect,viewController.bookedTours)
module.exports =router;