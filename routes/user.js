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
router.post("/login", loginUser);
router.get("/logout", logout);
module.exports = router;