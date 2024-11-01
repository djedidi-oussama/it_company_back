const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Service = require("../models/Service");
const cloudinary = require("cloudinary").v2;

// Get all services
const getAllServices = async (req, res) => {
  try {
    // Retrieve all services from the database
    const services = await Service.find();
    res.json({
      success: true,
      services, // The array will be empty if no services are found
    });
  } catch (error) {
    // Send a consistent error message for server errors
    res.status(500).json({ message: error.message });
  }
};

// Create a new service
const createService = catchAsyncErrors(async (req, res, next) => {
  const { title, description, imageUrl, tags, link } = req.body;

  try {
    // Upload the image to Cloudinary
    const imageResult = await cloudinary.uploader.upload(imageUrl, {
      folder: "services", // Specify the folder in Cloudinary
    });

    // Create and save the new service with Cloudinary URL
    const service = new Service({
      title,
      description,
      imageUrl: imageResult.secure_url, // Save image URL from Cloudinary
      tags,
      link,
    });

    const savedService = await service.save();
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: savedService,
    });
  } catch (error) {
    // Handle error in service creation
    res.status(400).json({ message: error.message });
  }
});

// Update a service by ID
const updateService = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, tags, link, imageUrl } = req.body;

  try {
    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (tags) updatedData.tags = tags;
    if (link) updatedData.link = link;

    // Update image if a new one is provided
    if (imageUrl) {
      const imageResult = await cloudinary.uploader.upload(imageUrl, {
        folder: "services",
      });
      updatedData.imageUrl = imageResult.secure_url; // Update image URL with new one
    }

    // Find service by ID and update with new data
    const updatedService = await Service.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(updatedService);
  } catch (error) {
    // Handle error in service update
    res.status(400).json({ message: error.message });
  }
});

// Delete a service by ID
const deleteService = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find and delete the service by ID
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(deletedService);
  } catch (error) {
    // Handle server error in deletion
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService,
};
