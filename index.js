const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const blogPostsRoutes = require("./routes/blogPosts");
const servicesRoutes = require("./routes/services");
const userRoutes = require("./routes/user");
const ErrorHandler = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://it-company-front.vercel.app", // Make sure there are no trailing slashes
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogPostsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/users", userRoutes);

// Error Handling
app.use(ErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
