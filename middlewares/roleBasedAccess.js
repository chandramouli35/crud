const roleBasedAccess = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        status: false,
        message: "Access denied: You do not have the required role",
      });
    }
    next();
  };
};

module.exports = roleBasedAccess;
