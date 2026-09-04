const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// PROTECT ROUTES
// ==========================================

const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token
      token =
        req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Find user from token
      req.user = await User.findById(
        decoded.id
      ).select("-password");

      // User not found
      if (!req.user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      console.error(
        "Authentication error:",
        error.message
      );

      return res.status(401).json({
        message:
          "Not authorized, token failed",
      });
    }
  }

  // No token
  if (!token) {
    return res.status(401).json({
      message:
        "Not authorized, no token",
    });
  }
};

// ==========================================
// ADMIN MIDDLEWARE
// ==========================================

const admin = (req, res, next) => {
  if (
    req.user &&
    req.user.role === "admin"
  ) {
    next();
  } else {
    return res.status(403).json({
      message:
        "Not authorized as an admin",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  protect,
  admin,
};