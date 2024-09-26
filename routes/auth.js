const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const sendOtpEmail = require("../routes/emailService");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = "secretcode";
const checkVerifiedUser = require("../middlewares/VerifiyUser");

// Signup route
router.post(
  "/signup",
  [
    check("username", "Username is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
    check("confirmPassword", "Confirm Password must match Password").custom(
      (value, { req }) => value === req.body.password
    ),
    check("role", "Invalid role").optional().isIn(["user", "admin", "tester"]),
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

    const { username, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          status: false,
          message: "User already exists",
        });
      }

      user = new User({
        username,
        email,
        password,
        role: role || "user", // Default to 'user' if no role is provided
      });

      // Hash password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();

      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      // Save user with OTP
      await user.save();

      // Simulate OTP email sending
      await sendOtpEmail(email, otp);

      res.status(201).json({
        status: true,
        message: "User registered successfully. Please check mail for OTP",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
);

// OTP Verification route
router.post(
  "/verify-otp",
  [
    check("email", "Please include a valid email").isEmail(),
    check("otp", "OTP is required").notEmpty(),
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

    const { email, otp } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }

      // Check if OTP has expired
      if (user.otpExpires < Date.now()) {
        return res.status(400).json({
          status: false,
          message: "OTP has expired",
        });
      }

      // Check if OTP matches
      if (user.otp !== otp) {
        return res.status(400).json({
          status: false,
          message: "Invalid OTP",
        });
      }

      // OTP is valid, update user verification status
      user.isVerified = true;
      user.otp = undefined; // Clear OTP after verification
      user.otpExpires = undefined; // Clear OTP expiry date
      await user.save();

      res.status(200).json({
        status: true,
        message: "User verified successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
);

// Login route
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").notEmpty(),
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

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Invalid credentials",
        });
      }

      // Check if the user's account is verified
      if (!user.isVerified) {
        return res.status(400).json({
          status: false,
          message: "Account not verified",
        });
      }

      // Check if the provided password matches the hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          status: false,
          message: "Invalid credentials",
        });
      }

      // Generate a JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "1h" }, // Token expires in 1 hour
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            status: true,
            message: "Login successfully",
            token, // Send the token back to the client
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
);

// Send OTP for Password Reset route
router.post(
  "/send-reset-otp",
  [
    check("email", "Please include a valid email").isEmail(),
    checkVerifiedUser, // Apply the middleware here
  ],
  async (req, res) => {
    const { email } = req.body;

    try {
      const user = req.user; // Access the verified user from the middleware

      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();

      user.resetOtp = otp;
      user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      await user.save();

      // Simulate OTP email sending
      await sendOtpEmail(email, otp);

      res.status(200).json({
        status: true,
        message: "OTP sent successfully. Please check your email.",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
);

// Reset Password with OTP route
router.post(
  "/reset-password-with-otp",
  [
    check("email", "Please include a valid email").isEmail(),
    check("otp", "OTP is required").notEmpty(),
    check(
      "newPassword",
      "Password must be at least 6 characters long"
    ).isLength({ min: 6 }),
    check(
      "confirmNewPassword",
      "Confirm Password must match New Password"
    ).custom((value, { req }) => value === req.body.newPassword),
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

    const { email, otp, newPassword } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }

      // Check if OTP has expired
      if (user.resetOtpExpires < Date.now()) {
        return res.status(400).json({
          status: false,
          message: "OTP has expired",
        });
      }

      // Check if OTP matches
      if (user.resetOtp !== otp) {
        return res.status(400).json({
          status: false,
          message: "Invalid OTP",
        });
      }

      // OTP is valid, update user password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      user.resetOtp = undefined; // Clear OTP after resetting password
      user.resetOtpExpires = undefined; // Clear OTP expiry date
      await user.save();

      res.status(200).json({
        status: true,
        message: "Password reset successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
);

module.exports = router;
