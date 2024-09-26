const express = require("express");
const router = express.Router();
const checkVerifiedUser = require("../middlewares/VerifiyUser");
const roleBasedAccess = require("../middlewares/roleBasedAccess");

// Example route accessible only by admins
router.get(
  "/",
  checkVerifiedUser, // First, verify the user's token
  roleBasedAccess("admin"), // Then, check if the user has an admin role
  (req, res) => {
    res.status(200).json({
      status: true,
      message: "Welcome Admin! You have access to this route.",
    });
  }
);

module.exports = router;
