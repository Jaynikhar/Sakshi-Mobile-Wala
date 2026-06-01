const xlsx = require("xlsx");
const Device = require("../models/Device");
const fs = require("fs");
const path = require("path");


exports.downloadFile = (req, res) => {
  try {
    const { filename } = req.params;

    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: "File not found" });
    }

    // ✅ READ FILE AS BUFFER
    const fileBuffer = fs.readFileSync(filePath);

    // ✅ SET HEADERS (VERY IMPORTANT)
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}`
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(fileBuffer); // ✅ SEND LIKE EXPORT

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getFiles = (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");

    const dir = path.join(__dirname, "../uploads");

    const files = fs.readdirSync(dir);

    const excelFiles = files.filter(
      f => f.endsWith(".xlsx") || f.endsWith(".xls")
    );

    res.json(excelFiles);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteFile = (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");

    const { filename } = req.params;

    const filePath = path.join(__dirname, "../uploads", filename);

    // check if exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: "File not found" });
    }

    fs.unlinkSync(filePath);

    res.json({ msg: "File deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.uploadDevice = async (req, res) => {
  try {
    console.log(req.file); // check file

    const device = await Device.create({
      name: req.body.name,
      image: req.file.filename, // save file name
    });

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.log(error);
  }
};

// EXPORT
exports.exportExcel = async (req, res) => {
  try {
    const devices = await Device.find();

    const formatted = devices.map((d) => ({
      name: d.name,
      ...Object.fromEntries(d.fields || []),
    }));

    const worksheet = xlsx.utils.json_to_sheet(formatted);
    const workbook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workbook, worksheet, "Devices");

    const buffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=devices.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Export failed" });
  }
};
// 📌 GET ALL DEVICES
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching devices" });
  }
};

// 📌 GET DEVICE BY ID (NEW - NO CHANGE TO OLD CODE)
exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      data: device,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching device",
    });
  }
};


// 📌 ADD DEVICE (with file upload)
exports.addDevice = async (req, res) => {
  try {
    const { name, image, fields } = req.body;

    const device = await Device.create({
      name,
      image,
      fields, // ✅ dynamic fields directly stored
      createdBy: req.user?._id // optional (if auth)
    });

    res.status(201).json({
      success: true,
      data: device
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding device" });
  }
};

// 📌 UPDATE DEVICE
exports.updateDevice = async (req, res) => {
  try {
    const { name, image, fields } = req.body;

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // ✅ update basic fields
    if (name) device.name = name;
    if (image) device.image = image;

    // ✅ merge dynamic fields
    if (fields) {
      Object.keys(fields).forEach(key => {
        device.fields.set(key, fields[key]);
      });
    }

    await device.save();

    res.json({
      success: true,
      data: device
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update error" });
  }
};

// 📌 DELETE DEVICE
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json({
      success: true,
      message: "Device deleted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Delete error" });
  }
};

exports.deleteField = async (req, res) => {
  try {
    const { key } = req.body; // e.g. "RAM"

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.fields.delete(key); // ✅ remove specific field

    await device.save();

    res.json({
      success: true,
      data: device
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Field delete error" });
  }
};

exports.searchDevices = async (req, res) => {
  try {
    const keyword =
      req.params.keyword ||
      req.query.keyword ||
      "";

    const trimmed = keyword.toString().trim();

    // ✅ if empty → return empty (not 404, not all data)
    if (!trimmed) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const devices = await Device.find({
      $or: [
        { name: { $regex: trimmed, $options: "i" } },
        { category: { $regex: trimmed, $options: "i" } },
        { brand: { $regex: trimmed, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search error" });
  }
};