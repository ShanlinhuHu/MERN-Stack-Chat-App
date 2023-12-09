const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  sendMessage,
  chatIdMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

// sent the message
router.route("/").post(protect, sendMessage);

// sent the message by chatId
router.route("/:chatId").get(protect, chatIdMessages);

module.exports = router;
