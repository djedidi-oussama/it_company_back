const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const BlogPost = require('../models/BlogPost');
const cloudinary = require('cloudinary').v2;



// Get all blog posts
const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json({
      success: true,
      blogPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new blog post
const createBlogPost = catchAsyncErrors(async (req, res, next) => {
  const { title, description,  content, image , tags , pdfUrl } = req.body; // Assuming you get title, content, and image from the request body
  try {
    // Upload the image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(image, {
      folder: 'blog_posts', // Specify the folder in Cloudinary
    });

    const cloudinaryPdfResult = await cloudinary.uploader.upload(pdfUrl, {
      folder: 'blog_posts',
      resource_type: 'auto',
    })

    // Create a new blog post with the Cloudinary image URL
    const blogPost = new BlogPost({
      title,
      description,
      content,
      image: cloudinaryResult.secure_url , // Store the Cloudinary URL in your blog post 
      tags ,
      pdfUrl :  "https://res-console.cloudinary.com/dgncqrtc5/media_explorer_thumbnails/" + cloudinaryPdfResult.asset_id + "/download"
    });

    const savedBlogPost = await blogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a blog post by ID
const updateBlogPost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description,  content, image , tags , pdfUrl } = req.body;
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Update mainImage if provided
    if (image) {
      const mainImageResult = await cloudinary.uploader.upload(image, {
        folder: 'blog_posts',

      });
      blog.image = mainImageResult.secure_url; // Update the main image URL
    } 
    if (pdfUrl) {
      const pdfResult = await cloudinary.uploader.upload(pdfUrl, {
        folder: 'blog_posts',
        resource_type: 'auto',
      })
      blog.pdfUrl = "https://res-console.cloudinary.com/dgncqrtc5/media_explorer_thumbnails/" + pdfResult.asset_id + "/download"

    }


    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    


    const updatesBlog = await blog.save();
    res.status(200).json(updatesBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a blog post by ID
const deleteBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
