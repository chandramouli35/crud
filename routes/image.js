const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const Image = require("../models/image");
const User = require("../models/user");

// Upload image route
router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: false,
      message: "No file uploaded",
    });
  }

  const { userId } = req.body;

  try {
    // Validate User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    // Create a new image record
    const image = new Image({
      userId,
      imageUrl: req.file.path, // Save the path of the uploaded image
    });

    await image.save();

    res.status(201).json({
      status: true,
      message: "Image uploaded successfully",
      data: image,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
