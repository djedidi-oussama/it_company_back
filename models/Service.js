// Service model schema definition for MongoDB using Mongoose
const mongoose = require('mongoose');

// Define the schema for a service
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title of the service is required
  },
  description: {
    type: String,
    required: true, // Description of the service is required
  },
  imageUrl: {
    type: String,
    required: true, // URL of the service image is required
  },
  tags: {
    type: [String], // Array of tags associated with the service
    required: true, // Tags are required
  },
  link: {
    type: String,
    required: true, // External link related to the service is required
  },
}, { timestamps: true }); // Enable automatic timestamps for createdAt and updatedAt

// Export the Service model based on the schema
const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
