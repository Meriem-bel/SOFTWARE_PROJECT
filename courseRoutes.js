const express = require('express');
const { createCourseController } = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const fileUploadMiddleware = require("../middlewares/fileUploadMiddleware");

const router = express.Router();

//create course
router.post('/createCourse', authMiddleware, fileUploadMiddleware.single("file"), createCourseController);

module.exports = router;