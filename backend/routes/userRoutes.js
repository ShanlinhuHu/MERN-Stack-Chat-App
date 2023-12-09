const express = require("express");
const {
  registerUser,
  loginUser,
  searchUser,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// check create user
router.route("/").post(registerUser);

// search/get all user
router.route("/").get(protect, searchUser);

// check user login
router.post("/login/", loginUser);

module.exports = router;
