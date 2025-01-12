const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        // Get the token from the Authorization header (Bearer token)
        const token = req.headers["authorization"].split(" ")[1];

        // Verify the token
        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'Unauthorized User'
                });
            } else {
                // Add the decoded user ID (teacherId) to the request body
                req.body.id = decoded.id;  // Teacher's ID is decoded from the token
                next();  // Proceed to the next middleware/controller
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Please provide Auth Token',
            error
        });
    }
};
