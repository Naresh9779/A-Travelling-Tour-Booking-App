const express = require('express');
const authController=require('../controllers/authController')
const bookingController = require('../controllers/bookingController')
const router=express.Router();

router.use(authController.protect)
router
.post('/book',bookingController.createBooking)
.get('/checkout-session/:tourId',bookingController.getCheckOutSession)

router.use(authController.restrictTo('admin','lead-guide'));
router
.route('/')
.get(bookingController.getAllBookings)
router
.route('/:id')
.get(bookingController.getBookings)
.post(bookingController.updateBooking)
.delete(bookingController.deleteBooking);
module.exports =router;
