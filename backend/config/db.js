const mongoose = require("mongoose");

const connectDB = () => {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      throw error; // ❌ NO process.exit()
    });
};

module.exports = connectDB;
