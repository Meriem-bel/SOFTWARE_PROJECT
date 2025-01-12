const Course = require('../models/courseModel');  // Import the course model

// Create a course
const createCourseController = async (req, res) => {
    try {
        // Destructure the course data from the request body
        const { title, description } = req.body;

        // Check if the file is provided in the request (assuming you're handling file uploads)
        if (!req.file) {
            return res.status(400).json({ message: "File is required." });
        }

        // Get the teacherId from the decoded token (it's in req.body.id because of the authMiddleware)
        const teacherId = req.body.id;  // This should be set by your authMiddleware

        if (!teacherId) {
            return res.status(400).json({ message: "Teacher ID is required." });
        }

        // Create a new course document with the data
        const course = new Course({
            title,
            description,
            teacherId,  // Assign teacherId from the token
            fileUrl: `/uploads/${req.file.filename}`, // Assuming the file URL is stored like this
        });

        // Save the course to the database
        await course.save();

        // Respond with success
        res.status(201).json({ message: "Course created successfully!", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating course.", error });
    }
};

module.exports = { createCourseController };
