const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, getUser);

module.exports = router;
