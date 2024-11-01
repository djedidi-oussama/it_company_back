// Import necessary modules
const express = require("express"); // Express framework for building web applications
const dotenv = require("dotenv"); // Package to load environment variables
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const connectDB = require("./config/db"); // Function to connect to MongoDB
const projectRoutes = require("./routes/projectRoutes"); // Project routes
const blogPostsRoutes = require("./routes/blogPosts"); // Blog posts routes
const servicesRoutes = require("./routes/services"); // Services routes
const userRoutes = require("./routes/user"); // User routes
const ErrorHandler = require("./middlewares/error"); // Error handling middleware
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies
const cloudinary = require("cloudinary"); // Cloudinary SDK for image uploads

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express(); // Create an Express application

// Middleware configuration
app.use(
  cors({
    origin: "https://it-company-front.vercel.app", // Allowed origin for CORS
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(cookieParser()); // Parse cookies
app.use(express.json({ limit: "50mb" })); // Parse JSON requests with a size limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Parse URL-encoded requests

// Configure Cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!"); // Respond with a simple message
});

// Define API routes
app.use("/api/projects", projectRoutes); // Project-related routes
app.use("/api/blogs", blogPostsRoutes); // Blog post-related routes
app.use("/api/services", servicesRoutes); // Service-related routes
app.use("/api/users", userRoutes); // User-related routes

// Error handling middleware
app.use(ErrorHandler); // Catch and handle errors

// Define the port for the server
const PORT = process.env.PORT || 5000; // Use the port from environment variables or default to 5000

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the server start message
});
