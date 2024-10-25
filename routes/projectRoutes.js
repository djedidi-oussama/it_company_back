// routes/projectRoutes.js
const express = require('express');
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const router = express.Router();
const {isAuthenticated} = require("../middlewares/authMiddleware"); // Authentication middleware

// GET all projects
router.get('/', getProjects);

// GET a project by ID
router.get('/:id', getProjectById);

// POST a new project
router.post('/create', isAuthenticated, createProject);

// PUT (Update) a project by ID
router.put('/:id', isAuthenticated, updateProject);

// DELETE a project by ID
router.delete('/:id', isAuthenticated, deleteProject);

module.exports = router;
