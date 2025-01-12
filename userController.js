const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
// GET USER INFO
const getUserController = async (req, res) => {
    try {
        // find user
        const user = await userModel.findById({_id:req.body.id});
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User Not Found',
            });
        }
        //hide password
        user.password = undefined
        //resp
        res.status(200).send({
            success:true,
            message:'User get Successfully',
            user
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Eror in Get User API',
            error
        });
    }
};

//UPDATE USER
const updateUserController = async (req,res) => {
    try {
        //find user
        const user = await userModel.findById({_id: req.body.id})
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'user not found'
            });
        }
        //update
        const {userName} = req.body
        if(userName) user.userName = userName;
        //save user
        await user.save();
        res.status(200).send({
            success: true,
            message: "User Updated Successfully",
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Update User API',
    error        

        });
    }
};

// UPDATE USER PASSWORD
const updatePasswordController = async (req, res) => {
    try {
        const { id, oldPassword, newPassword } = req.body;

        // Validate request data
        if (!id || !oldPassword || !newPassword) {
            return res.status(400).send({
                success: false,
                message: "User ID, old password, and new password are required",
            });
        }

        // Find user
        const user = await userModel.findById({ _id: id });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Invalid old password",
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Save with validation disabled
        await user.save({ validateBeforeSave: false });

        res.status(200).send({
            success: true,
            message: "Password Updated!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error In Password Update API",
            error,
        });
    }
};

//RESET PASSWORD
const resetPasswordController = async(req, res) => {
    try {
        const {email,newPassword, answer} = req.body
        if(!email || !newPassword || !answer){
            return res.status(500).send({
                success:false,
                message:'Please Provide all fields'
            })
        }
        const user = await userModel.findOne({email,answer})
        if(!user){
            return res.status(500).send({
                success:false,
                message:'User Not Found or invalid answer'
            });
        }
        // hashing password
                var salt = bcrypt.genSaltSync(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashedPassword
                await user.save()
                res.status(200).send({
                    success: true,
                    message:"Password Reset Successfully",
                });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in RESET PASSWORD API',
            error,
        });
    }
};
//DELETE PROFILE ACCOUNT
const deleteProfileController = async(req,res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "Your account has been deleted",
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Delete Profile API',
            error
        });
    }
};

module.exports = {getUserController, updateUserController, updatePasswordController, resetPasswordController, deleteProfileController};