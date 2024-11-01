// Import custom middleware to handle asynchronous errors
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Import the BlogPost model for interacting with the blog post data in the database
const BlogPost = require("../models/BlogPost");

// Import Cloudinary for handling media uploads
const cloudinary = require("cloudinary").v2;

// Get all blog posts
const getAllBlogPosts = async (req, res) => {
  try {
    // Fetch all blog posts from the database
    const blogPosts = await BlogPost.find();
    res.json({
      success: true,
      blogPosts,
    });
  } catch (error) {
    // Send error response if there's an issue with the database query
    res.status(500).json({ message: error.message });
  }
};

// Create a new blog post
const createBlogPost = catchAsyncErrors(async (req, res, next) => {
  // Destructure blog post details from the request body
  const { title, description, content, image, tags, pdfUrl } = req.body;
  try {
    // Upload the image to Cloudinary and store the result
    const cloudinaryResult = await cloudinary.uploader.upload(image, {
      folder: "blog_posts", // Specify the folder in Cloudinary to store images
    });

    // Upload PDF to Cloudinary if provided and store the result
    const cloudinaryPdfResult = await cloudinary.uploader.upload(pdfUrl, {
      folder: "blog_posts",
      resource_type: "auto", // Allow Cloudinary to handle any file type
    });

    // Create a new blog post instance with Cloudinary URLs for image and PDF
    const blogPost = new BlogPost({
      title,
      description,
      content,
      image: cloudinaryResult.secure_url, // Use the Cloudinary image URL
      tags,
      pdfUrl:
        "https://res-console.cloudinary.com/dgncqrtc5/media_explorer_thumbnails/" +
        cloudinaryPdfResult.asset_id +
        "/download", // Construct URL for PDF
    });

    // Save the blog post to the database and return a success response
    const savedBlogPost = await blogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    // Send error response if there was an issue creating the blog post
    res.status(400).json({ message: error.message });
  }
});

// Update a blog post by ID
const updateBlogPost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Extract the blog post ID from the request parameters
  const { title, description, content, image, tags, pdfUrl } = req.body;

  try {
    // Find the blog post by ID
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Update main image if a new one is provided
    if (image) {
      const mainImageResult = await cloudinary.uploader.upload(image, {
        folder: "blog_posts",
      });
      blog.image = mainImageResult.secure_url; // Set new image URL
    }

    // Update PDF URL if a new PDF is provided
    if (pdfUrl) {
      const pdfResult = await cloudinary.uploader.upload(pdfUrl, {
        folder: "blog_posts",
        resource_type: "auto",
      });
      blog.pdfUrl =
        "https://res-console.cloudinary.com/dgncqrtc5/media_explorer_thumbnails/" +
        pdfResult.asset_id +
        "/download"; // Set new PDF URL
    }

    // Update blog post properties if new values are provided
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;

    // Save and return the updated blog post
    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    // Send error response if there's an issue updating the blog post
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a blog post by ID
const deleteBlogPost = async (req, res) => {
  const { id } = req.params; // Extract the blog post ID from the request parameters
  try {
    // Find and delete the blog post by ID
    const deletedBlogPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedBlogPost) {
      // Send a 404 error if the blog post wasn't found
      return res.status(404).json({ message: "Blog post not found" });
    }
    // Return a success message on successful deletion
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    // Send error response if there's an issue deleting the blog post
    res.status(500).json({ message: error.message });
  }
};

// Export the functions so they can be used in other parts of the application
module.exports = {
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
