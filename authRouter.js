const express = require('express');
const authController = require('./../Controllers/authController');
Router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword').post(authController.resetPassword);

module.exports = router;
