const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const User = require("../models/User");

// ✅ GET ALL USERS (ONLY AUTHOR)
router.get("/", auth, role("author"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ UPDATE ROLE (ONLY AUTHOR)
router.put("/:id", auth, role("author"), async (req, res) => {
  try {
    const { role: newRole } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: newRole },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;