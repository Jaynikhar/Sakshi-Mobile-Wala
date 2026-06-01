const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: String,     // e.g. "battery", "ram"
  type: String      // string, number, etc.
});

module.exports = mongoose.model("Field", fieldSchema);