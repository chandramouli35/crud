const cron = require("node-cron");
const User = require("../models/user");
const sendOtpEmail = require("../routes/emailService");

// Scheduled a task to run every minute
cron.schedule("0 0 * * *", async () => {
  try {
    // Sending reminder emails to users
    const users = await User.find({});
    users.forEach((user) => {
      // Generate an OTP if needed
      const otp = user.otp || "123456";
      sendOtpEmail(user.email, otp); // Send OTP email
    });
    console.log("OTP emails  successfully at", new Date().toISOString());
  } catch (err) {
    console.error("Error in scheduled task:", err.message);
  }
});
