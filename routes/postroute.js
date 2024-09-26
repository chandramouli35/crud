const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const checkVerifiedUser = require("../middlewares/VerifiyUser");
const Post = require("../models/post");
router.post(
  "/",
  checkVerifiedUser, // Applying auth middleware
  [
    check("title", "Title is required").not().isEmpty(),
    check("content", "Content is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, content } = req.body;

    try {
      const newPost = new Post({
        title,
        content,
        user: req.user.id, // Assuming `user.id` is stored in the token payload
      });

      const post = await newPost.save();

      res.status(201).json({
        status: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ status: false, message: "Server error", error: err.message });
    }
  }
);

module.exports = router;
