const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    console.log("Authenticated User:", user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
