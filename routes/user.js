const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
    registerUser,
    loginUser ,
    loadUser ,
    logout
} = require("../controllers/userController");

//router.post("/register", registerUser);
// get user
router.get("/getuser", isAuthenticated, loadUser);

// login
router.post("/login", loginUser);

// logout
router.get("/logout", logout);
module.exports = router;