
const mongoose = require('mongoose');
const app=require('./app');
const dotenv=require('dotenv');

dotenv.config({path:'./config.env'});

process.on('uncaughtException',err=>{

    console.log('*********UNCaught Expectation Shutting down *********');
    console.log(err.name,err.message);
    process.exit(1);
    

});

const DB=process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB,{
   
    autoIndex: true, 
}).then(()=>{
    console.log("Db connection is established");


 });

const port=process.env.PORT||3000;
const server=app.listen(port,()=>{

console.log(`listening on port ${port}`);

});
process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('*********UNHANDLED REJECTECTION Shutting down *********');
    server.close(()=>{

        process.exit(1);
    })
});
process.on('uncaughtException',err=>{

    console.log('*********UNCaught Expectation Shutting down *********');
    console.log(err.name,err.message);
    server.close(()=>{

        process.exit(1);
    })


});



