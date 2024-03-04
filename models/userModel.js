const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const userSchema=new mongoose.Schema({
name: {
    type:String,
    required:[true,'Please Enter Ur Name']
},
email :{
    type:String,
    required:[true,'Please Enter Email'],
    unique:true,
    lowercase:true,
    validate:[validator.isEmail,'Please Enter  Valid Email']


},
photo :{type:String,default:'default.jpg'},
role:{
    type:String,
    enum:['user', 'admin', 'guide','lead-guide'],
    default:'user'
},
password:{
    type:String,
    required:[true,'Please Enter Password'],
    select :false,
    minlength:8
},
passwordConfirm:{
    type:String,
    required:[true,'Please Enter Password'],
   
    validate: {
        // work ONly On create
        validator: function(el){
            return el ===this.password;
        },
        message: "Passwords do not match"
    }

},
passwordChangedAt: Date,
passwordResetToken:String,
resetTokenExpires:Date,
active:{
    type:Boolean,
    default:true,
    select:false
}

},{toJSON:{virtuals:true},
toObj:{virtuals:true} });
userSchema.pre('save', async function(next){
    if(!this.isModified('password'))return next();
    
        this.password= await bcrypt.hash(this.password,12);
        this.passwordConfirm =undefined;
        next ();
    
});

userSchema.pre('save', function(next){

    if(!this.isModified('password')||this.isNew)return next();
    this.passwordChangedAt=Date.now()-1000;
    next();





});
userSchema.pre(/^find/, function(next){
    this.find({active:{$ne:false}});
     next();

});
userSchema.methods.correctPassword= async function(candidatePassword,userPassword)
{
    return  await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.changedPasswordAfter=function(JWTTimestamp)
{
    if(this.passwordChangedAt)
    {
 const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
       return JWTTimestamp < changedTimeStamp;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = function()
{
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpires= Date.now()+10*60*1000;
    
    return resetToken;
}
const User=mongoose.model('User',userSchema);
module.exports = User;