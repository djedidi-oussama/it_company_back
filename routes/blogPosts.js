const express = require('express');
const {
  getAllBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} = require ('../controllers/blogPostController');
const {isAuthenticated} = require("../middlewares/authMiddleware"); // Authentication middleware


const router = express.Router();

// Get all blog posts
router.get('/', getAllBlogPosts);

// Create a new blog post
router.post('/create', isAuthenticated, createBlogPost);

// Update a blog post by ID
router.put('/:id',  isAuthenticated, updateBlogPost);

// Delete a blog post by ID
router.delete('/:id',  isAuthenticated, deleteBlogPost);

module.exports = router;