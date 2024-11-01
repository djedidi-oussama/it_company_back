// Custom error handling middleware for Express
const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  // Set default status code and message if not provided
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // Handle invalid MongoDB ID errors
  if (err.name === "CastError") {
    const message = `Resource not found with this id. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handle duplicate key errors (e.g., unique fields in MongoDB)
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Handle invalid JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = `Your URL is invalid. Please try again later.`;
    err = new ErrorHandler(message, 400);
  }

  // Handle expired JWT errors
  if (err.name === "TokenExpiredError") {
    const message = `Your URL has expired. Please try again later.`;
    err = new ErrorHandler(message, 400);
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
