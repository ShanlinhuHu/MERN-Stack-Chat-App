const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChat,
  accessGroupChat,
  renameGroupChat,
  removeUserGroupChat,
  addUserGroupChat,
} = require("../controllers/chatControllers");

const router = express.Router();

// access the chat, create chat
router.route("/").post(protect, accessChat);

// get chat own by user
router.route("/").get(protect, fetchChat);

// access group chat
router.route("/group").post(protect, accessGroupChat);

// rename group chat
router.route("/renamegroup").patch(protect, renameGroupChat);

// user remove from the group chat
router.route("/removegroup").patch(protect, removeUserGroupChat);

// user add from the group chat
router.route("/addgroup").patch(protect, addUserGroupChat);

module.exports = router;
