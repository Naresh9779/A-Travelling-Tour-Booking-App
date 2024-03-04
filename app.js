const path=require('path');
const express=require('express');
const app=express();
const morgan = require('morgan');
const AppError=require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const viewRouter=require('./routes/viewRoutes');
const bookingRouter=require('./routes/bookingRoutes');

const rateLimiter=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser = require('cookie-parser');

 
const dotenv=require('dotenv');

dotenv.config({path:'./config.env'});

app.set('view engine', 'pug');
app.set('views',path.join('views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware

//Used To Sanitize Malicious Mongo Query
app.use(mongoSanitizer());

// used To Avaoid Malicious Html Data
app.use(xss());

//Use for  Header
app.use(helmet({ contentSecurityPolicy: false }));
// use For POllution 
app.use(hpp({
  whitelist:['price',
  'duration',
  'difficulty','ratingsAverage',
'maxGroupSize',
'ratingsQuantity']

}))
app.use(cookieParser());
// Check environment
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

// parsing Data 
  app.use(express.json({limit:'10 kb' }));


// Fetch date
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
       next();
  });

// Limit The Request
const limiter=rateLimiter({
  windowMs: 60*60 * 1000,
  max: 100,
  message: "You have exceeded your 100 requests per hour limit."
  
});

app.use('/api',limiter);
//   Routes


app.use('/api/v1/tours',tourRouter);
app.use( '/api/v1/users',userRouter);
app.use( '/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);
app.use('/',viewRouter);


app.all('*',(req,res,next)=>{

next(new AppError(`Not Found ${req.originalUrl}`) );
});
app.use(globalErrorHandler);

module.exports =app;
