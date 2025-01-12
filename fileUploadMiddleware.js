const multer = require("multer");
const path = require("path");


//storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); //folder to store files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); //Unique file name
    },
});


// File type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type! Only PDF and PowerPoint files are allowed."), false);
    }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;