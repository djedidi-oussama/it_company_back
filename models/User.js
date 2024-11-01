// User model schema definition for MongoDB using Mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for generating JWT tokens

// Define the schema for a user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Username must be unique
  password: { type: String, required: true }, // Password is required
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  // Check if the password is modified
  if (!this.isModified("password")) {
    return next(); // Skip hashing if the password hasn't been modified
  }

  // Hash the password with bcrypt
  this.password = await bcrypt.hash(this.password, 10);
  next(); // Proceed to save the user
});

// Generate a JWT token for the user
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { // Sign the token with the user ID
    expiresIn: process.env.JWT_EXPIRES, // Set expiration from environment variables
  });
};

// Compare entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Return comparison result
};

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
