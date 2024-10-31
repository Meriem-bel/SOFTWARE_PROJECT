const crypto = require('crypto');

passwordChangedAt : Date,
passwordResetToken : String,
passwordResetTokenExpires : Date,


userSchema.methods.isPasswordChanged = async function(JTTimesstamp){
    if(this.passwordChangedAt){

    }
    return false;
}

userSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    console.log(resetToken, this.passwordResetToken);
    return resetToken;
}