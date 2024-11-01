// Middleware to handle asynchronous errors in Express routes
module.exports = (theFunc) => (req, res, next) => {
  // Executes the passed function and catches any errors
  Promise.resolve(theFunc(req, res, next)).catch(next); 
};
