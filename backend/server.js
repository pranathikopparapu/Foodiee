const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

/* ✅ CORS FIX FOR DEPLOYED FRONTEND */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://foodiee-liard.vercel.app/" // 🔁 replace with your actual frontend URL
    ],
    credentials: true,
  })
);

app.use(express.json());

/* ✅ ROUTES */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/test", require("./routes/testMail"));

/* ✅ PORT (RENDER REQUIRED) */
const PORT = process.env.PORT || 5000;

/* ✅ CONNECT DB → START SERVER */
connectDB()
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
