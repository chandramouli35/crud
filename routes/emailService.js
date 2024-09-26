const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "b79e063364eb00",
    pass: "dbe618523927c8",
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "tarigopulachandramouli1818@gmail.com",
    to: email,
    subject: "Your OTP for Signup",
    text: `Your OTP for signup is: ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP  sent successfully");
  } catch (error) {
    console.error("Error sending OTP :", error);
    throw new Error("Failed to send OTP ");
  }
};

module.exports = sendOtpEmail;
