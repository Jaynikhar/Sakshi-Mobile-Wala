const Field = require("../models/Field");

// AUTHOR adds new column
exports.addField = async (req, res) => {
  const field = await Field.create(req.body);
  res.json(field);
};

// get all fields
exports.getFields = async (req, res) => {
  const fields = await Field.find();
  res.json(fields);
};