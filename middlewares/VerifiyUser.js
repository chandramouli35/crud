// const User = require("../models/user");

// const checkVerifiedUser = async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     if (!user.isVerified) {
//       return res.status(400).json({
//         status: false,
//         message: "Account not verified",
//       });
//     }

//     // If the user is verified, attach the user to the request object and proceed
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       status: false,
//       message: "Server error",
//       error: err.message,
//     });
//   }
// };

// module.exports = checkVerifiedUser;

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = "secretcode"; // Use an environment variable for the secret

const checkVerifiedUser = async (req, res, next) => {
  // Get the token from the request header
  const token = req.header("x-auth-token");

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "No token, authorization denied",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user by the id in the token payload
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        status: false,
        message: "Account not verified",
      });
    }

    // Attach the user to the request object and proceed
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = checkVerifiedUser;
