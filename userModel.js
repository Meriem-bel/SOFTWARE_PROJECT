const mongoose = require('mongoose')

//shema
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true, 'user name is required']
    },
    email:{
        type:String,
        required:[true, 'email is required']
    },
    password:{
        type:String,
        required:[true, 'password is required']
    },
    usertype:{
        type:String,
        required:[true,'user type is rquired'],
        default:'student',
        enum:['student', 'admin', 'teacher']
    },
    profile:{
        type:String,
        default:'data:image/jpeg;base64,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'
    },
    answer:{
        type:String,
        required:[true,"Answer is required"],
    },
},{timestamps:true});

//export
module.exports = mongoose.model("User", userSchema);