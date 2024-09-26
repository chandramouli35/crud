const express = require("express");
const router = express.Router();
const Pagination = require("../models/pagination");
const User = require("../models/user");

// GET API for retrieving paginated user data
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  try {
    // Fetch paginated user data
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Get total count for pagination
    const count = await User.countDocuments();

    res.status(200).json({
      status: true,
      page: Number(page),
      limit: Number(limit),
      totalCount: count,
      data: users,
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
