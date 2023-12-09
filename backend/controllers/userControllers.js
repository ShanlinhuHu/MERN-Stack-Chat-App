const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// create new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Enter all the required fields" });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400).json({ error: "User already exists" });
  }

  try {
    const user = await User.create({
      name,
      username,
      password,
    });

    if (user) {
      const token = generateToken(user.id);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      return res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// User login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  try {
    if (user && (await user.passwordMatch(password))) {
      const token = generateToken(user.id);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to login, Wrong username or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const searchUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        name: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, loginUser, searchUser };
