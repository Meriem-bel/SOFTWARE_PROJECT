exports.forgotPassword = (req, res, next)=>{
    const user = await UserActivation.findOne({email: req.body.email});
    if(!user){
        const error = new CustomerError('We could not find the user with the given email', 404);
        next(error);
    }

    const resetToken = user.create ResetPasswordToken();
    awail user.save({validateBeforeSave: false});
}

exports.ResetPassword = (req, res, next)=>{
    
}