const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Project = require('../models/Project');
const cloudinary = require('cloudinary').v2;

// Get all projects
const getProjects = async (req, res) => {
  try {
    // Retrieve all projects from the database
    const projects = await Project.find();
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    // Retrieve a single project by its ID
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new project
const createProject = catchAsyncErrors(async (req, res, next) => {
  const { name, category, description, content, mainImage, images } = req.body;

  try {
    // Upload the main image to Cloudinary
    const mainImageResult = await cloudinary.uploader.upload(mainImage, {
      folder: 'projects', // Specify folder in Cloudinary
    });

    // Upload additional images to Cloudinary
    const imageUploadPromises = images.map(image =>
      cloudinary.uploader.upload(image, { folder: 'projects' })
    );

    const imagesResults = await Promise.all(imageUploadPromises);
    const imageUrls = imagesResults.map(result => result.secure_url);

    // Create and save the new project with Cloudinary URLs
    const newProject = new Project({
      name,
      category,
      description,
      content,
      mainImage: mainImageResult.secure_url, // Main image Cloudinary URL
      images: imageUrls // Array of additional image URLs
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a project
const updateProject = catchAsyncErrors(async (req, res, next) => {
  const { name, category, description, content, mainImage, images } = req.body;

  try {
    // Find the project by ID
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Update mainImage if provided
    if (mainImage) {
      const mainImageResult = await cloudinary.uploader.upload(mainImage, {
        folder: 'projects',
      });
      project.mainImage = mainImageResult.secure_url; // Update main image URL
    }

    // Update additional images if provided
    if (images && images.length > 0) {
      const imageUploadPromises = images.map(image =>
        cloudinary.uploader.upload(image, { folder: 'projects' })
      );

      const imagesResults = await Promise.all(imageUploadPromises);
      const imageUrls = imagesResults.map(result => result.secure_url);
      project.images = imageUrls; // Update array of image URLs
    }

    // Update project details
    project.name = name || project.name;
    project.category = category || project.category;
    project.description = description || project.description;
    project.content = content || project.content;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a project
const deleteProject = catchAsyncErrors(async (req, res, next) => {
  try {
    // Delete a project by ID
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(deleted);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
