const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const { addField, getFields } = require("../controllers/fieldController");

router.post("/", protect, role("author"), addField);
router.get("/", protect, getFields);

module.exports = router;