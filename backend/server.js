const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

/* ✅ MIDDLEWARE */
app.use(
  cors({
    origin: "*", // ✅ allow all origins (safe for now)
    credentials: true,
  })
);
app.use(express.json());

/* ✅ ROOT CHECK (Render health check) */
app.get("/", (req, res) => {
  res.status(200).send("Foodiee Backend is running 🚀");
});

/* ✅ API ROUTES */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/test", require("./routes/testMail"));

/* ✅ PORT (Render compatible) */
const PORT = process.env.PORT || 5000;

/* ✅ CONNECT DB → START SERVER */
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
