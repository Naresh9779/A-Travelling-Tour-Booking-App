
const { HttpStatusCode } = require('axios');
const AppError = require('../utils/appError');
const handleCastErrorDB = err => {
        const message = `Invalid${err.path}: ${err.value}`;
        return new AppError(message, 400);
};
const handleDuplicateFieldDB= err => {
        const errors =Object.values(err.errors).map(el=>el.message)
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/);[0];
        const message = `The Name :${value} Already Exist Try Another `;
        return new AppError(message,400);
};
const handleValidationErrorDB=err => {
        const errors =Object.values(err.errors).map(el=>el.message)

const message=`Invalid Input Data .${errors.join('.')}`;
return new AppError(message,400);



}
const handleJWTErrorDB=err => new AppError('Invalid JWT',401);
const handleJWTExpiredError=err => new AppError('Your JWT Token expired Login again',401);


const errorDev = (err, res,req) => {
        //API error
    if(req.originalUrl.startsWith('/api'))
        {  
                return res.status(err.statusCode).json({
                status: err.status,
                error: err,
                stack: err.stack,
                message: err.message


        });}
        //REnder error
          console.log('Error 🔥🔥',err)
        return res.status(err.statusCode).render('error',{
                title:'Something went wrong',
                msg:err.message
        })
};

const errorProd = (err, res,req) => {
        if(req.originalUrl.startsWith('/api'))
        {

        if (err.isOperational) {
               return res.status(500).json({
                        status: err.status,
                        message: err.message


                });
        }
        console.log('Error 🔥🔥',err)
               return res.status(500).json({
                        status: 'error',
                        message: 'Something went wrong'
                });
        
}

else
{
        if (err.isOperational) {
                return res.status(err.statusCode).render('error',{
                        title: 'Error',
                        msg: err.message
 
 
                 });
         }
         console.log('Error 🔥🔥',err);
                return res.status(statusCode).render('error',{
                        title: 'Error',
                        msg: err.message
                 });

}


};


module.exports = (err, req, res, next) => {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
      

 if (process.env.NODE_ENV ==='development') {
       errorDev(err,res,req);

}


        else if (process.env.NODE_ENV ==='production') {
                let error = err;
                
                if (error.name ==="CastError")error = handleCastErrorDB(error);
                if(error.code===11000)error=handleDuplicateFieldDB(error);
                
                if(error.name==="ValidationError")error=handleValidationErrorDB(error);
               
                if(error.name==='JsonWebTokenError' ) error=handleJWTErrorDB();

                if(error.name==='TokenExpiredError' ) error=handleJWTExpiredError();

                errorProd(error, res,req);
        }
};