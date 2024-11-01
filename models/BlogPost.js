// BlogPost model schema definition for MongoDB using Mongoose
const mongoose = require("mongoose");

// Define the schema for a blog post
const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title is required
    },
    description: {
      type: String,
      required: true, // Short description is required
    },
    content: {
      type: String,
      required: true, // Main content of the blog post is required
    },
    image: {
      type: String,
      required: true, // URL of the main image is required
    },
    tags: {
      type: [String],
      required: true, // Tags for categorization are required
    },
    pdfUrl: { 
      type: String // Optional URL to a PDF version of the blog post
    },
  },
  { timestamps: true } // Enable automatic timestamps for createdAt and updatedAt
);

// Create a model for the BlogPost schema
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost; // Export the BlogPost model for use in other parts of the application
