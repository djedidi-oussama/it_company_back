const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to check if user is authenticated
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => { 
    const { token } = req.cookies; // Retrieve token from cookies

    // If no token is found, return an unauthorized error
    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    // Verify token and decode it using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded ID and attach user data to the request
    req.user = await User.findById(decoded.id);

    next(); // Continue to the next middleware or route handler
});
