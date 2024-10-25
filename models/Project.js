// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  images: {
    type: [String],  // Array of strings for multiple image URLs
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
