const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },
  role: {
    type: String,
    enum: ["user", "admin", "tester"], // Define the roles available
    default: "user", // Set a default role
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
