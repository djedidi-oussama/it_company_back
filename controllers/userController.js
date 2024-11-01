const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");

// Generate JWT Token and send it in a cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Cookie options
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days expiry
    httpOnly: true, // Cookie accessible only by the web server
    sameSite: "none", // Ensures cookie is sent cross-site
    secure: true, // Cookie sent only over HTTPS
  };

  // Send response with the token in a cookie
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      token,
    });
};

// Load user details
const loadUser = catchAsyncErrors(async (req, res, next) => {
  try {
    // Find user by ID stored in request after authentication
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    // Error handling for server issues
    return next(new ErrorHandler(error.message, 500));
  }
});

// Register a new user
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create and save new user
  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Login a user
const loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    // Find user by username
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exist!", 400));
    }

    // Validate the password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    // Send token if authentication is successful
    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Logout user
const logout = catchAsyncErrors(async (req, res, next) => {
  try {
    // Clear the cookie with token on logout
    res.cookie("token", null, {
      expires: new Date(Date.now()), // Cookie expiration set to now
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  registerUser,
  loginUser,
  loadUser,
  logout,
};
