const express = require('express');
const { 
    getUserController,
    updateUserController,
    updatePasswordController,
    resetPasswordController,
    deleteProfileController,

} = require('../controllers/userController');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//routes
//Get USER || GET
router.get('/getUser', authMiddleware, getUserController);

//Update profile
router.put('/updateUser', authMiddleware, updateUserController);

//password update
router.post("/updatePassword", authMiddleware, updatePasswordController);


//RESET PASSWORD
router.post('/resetPassword', authMiddleware, resetPasswordController);


// DELETE USER
router.delete('/deleteUser/:id', authMiddleware, deleteProfileController);
module.exports = router;