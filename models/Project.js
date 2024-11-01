// Project model schema definition for MongoDB using Mongoose
const mongoose = require('mongoose');

// Define the schema for a project
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Project name is required
  },
  category: {
    type: String,
    required: true, // Category of the project is required
  },
  description: {
    type: String,
    required: true, // Short description is required
  },
  content: {
    type: String,
    required: true, // Detailed content or description of the project is required
  },
  mainImage: {
    type: String,
    required: true, // URL of the main image is required
  },
  images: {
    type: [String],  // Array of image URLs for additional project images
  },
}, { timestamps: true }); // Enable automatic timestamps for createdAt and updatedAt

// Export the Project model based on the schema
module.exports = mongoose.model('Project', projectSchema);
