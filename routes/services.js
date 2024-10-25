const express = require("express");
const {
  getAllServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController.js");
const {isAuthenticated} = require("../middlewares/authMiddleware"); // Authentication middleware

const router = express.Router();

// Get all services
router.get("/", getAllServices);

// Create a new service
router.post("/create", isAuthenticated, createService);

// Update a service by ID
router.put("/:id", isAuthenticated, updateService);

// Delete a service by ID
router.delete("/:id", isAuthenticated, deleteService);

module.exports = router;
