const xlsx = require("xlsx");
const Device = require("../models/Device");

exports.importExcel = async (filePath, userId) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = xlsx.utils.sheet_to_json(sheet);

  const formatted = data.map(row => {
    const { name, ...rest } = row;

    return {
      name: name || "Unnamed",
      fields: rest, // dynamic fields
      createdBy: userId
    };
  });

  await Device.insertMany(formatted);
};