const path =require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadDevice } = require("../controllers/deviceController");
const protect = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
// const upload = require("../middleware/uploadMiddleware");


//storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// route
router.post("/upload", upload.single("file"),  uploadDevice);
const {
  addDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  searchDevices,
  exportExcel,
  deleteField,
  getFiles,
  deleteFile,
  downloadFile
} = require("../controllers/deviceController");







const { importExcel } = require("../services/excelService");

// IMPORT EXCEL
router.post(
  "/import",
  protect,
  role("author"),
  upload.single("file"),
  async (req, res) => {
    try {
      await importExcel(req.file.path, req.user._id);
      res.json({ msg: "Excel imported successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

// EXPORT EXCEL
router.get("/export",protect, role("author"), exportExcel);
router.get("/files", protect, role("author"), getFiles);
router.get("/files/:filename", downloadFile); // download ✅
// DELETE FILE
router.delete("/files/:filename", protect, role("author"), deleteFile);
// DEBUG
console.log(typeof getDevices);

// ROUTES
router.get("/", protect, getDevices);
router.get("/:id", getDeviceById);

//route WITHOUT keyword
router.get("/search", searchDevices);
//route WITH keyword
router.get("/search/:keyword", searchDevices);

router.post("/", protect, role("editor", "author"),upload.single("file"),  addDevice);
router.put("/:id", protect, role("editor", "author"),upload.single("file"),  updateDevice);
router.delete("/:id", protect, role("author"), deleteDevice);
// router.put("/delete-field/:id", deleteField);
router.delete("/delete-field/:id", protect, role("editor", "author"), deleteField);

// // IMPORT EXCEL
// router.post(
//   "/import",
//   protect,
//   role("author"),
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       await importExcel(req.file.path, req.user._id);
//       res.json({ msg: "Excel imported successfully" });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   }
// );

// // EXPORT EXCEL
// router.get(
//   "/export",
//   protect,
//   role("author"),
//   exportExcel
// );

module.exports = router;