const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getUser,
};
