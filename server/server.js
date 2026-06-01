const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const deviceRoutes = require("./routes/deviceRoutes");
const userRoutes = require("./routes/userRoutes");


dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "https://sakshi-mobile-wala.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/devices", require("./routes/deviceRoutes"));
app.use("/api/fields", require("./routes/fieldRoutes"));

app.listen(5000, () => console.log("Server running"));