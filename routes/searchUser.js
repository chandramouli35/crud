// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const checkVerifiedUser = require("../middlewares/VerifiyUser");

// Route to search users by username
router.get("/search", async (req, res) => {
  try {
    const username = req.query.username;
    const users = await User.find({ username: new RegExp(username, "i") }); // Case-insensitive search
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
});

module.exports = router;
