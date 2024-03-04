const express = require('express');
const userController= require('../controllers/userController');
const authController= require('../controllers/authController');


const router=express.Router();
router.post('/signup',authController.signUp);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);


router.use(authController.protect)



router.patch('/updatePassword',authController.updatePassword);
router.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe);
router.delete('/deleteMe',userController.deleteMe);


router
.route('/me')
.get(userController.getMe,userController.getUser);

router
.route('/')
.get(authController.restrictTo('admin'),userController.getAllusers)


router
.route('/:id')
.patch(authController.restrictTo('admin'),userController.updateUser)
.get(authController.restrictTo('admin'),userController.getUser)
.delete(authController.restrictTo('admin'),userController.deleteUser)


module.exports = router;
