const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  flat: String,
  street: String,
  pincode: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },

  // ✅ ADD THIS
  savedAddresses: [addressSchema],

  resetOTP: String,
  otpExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);
