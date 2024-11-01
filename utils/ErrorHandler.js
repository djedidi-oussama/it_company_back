// Custom Error Handler class that extends the built-in Error class
class ErrorHandler extends Error {
  
    // Constructor accepts a message and a status code
    constructor(message, statusCode) {
      super(message); // Call the parent class constructor with the error message
      this.statusCode = statusCode; // Set the status code property
  
      // Capture the stack trace for the error
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Export the ErrorHandler class for use in other modules
  module.exports = ErrorHandler;
  