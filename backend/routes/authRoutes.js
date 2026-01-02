const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,   // ✅ LOWERCASE
      password: hashedPassword,
      role: "user",
    });

    res.json("User registered successfully");
  } catch (err) {
    res.status(500).json("Registration failed");
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json("Login failed");
  }
});

/* ================= FORGOT PASSWORD (OTP) ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const normalizedEmail = req.body.email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Hi ${user.name},

Your OTP for password reset is: ${otp}

This OTP is valid for 10 minutes.

Foodiee Team 🍔`
    );

    res.json("OTP sent to registered email");
  } catch (err) {
    res.status(500).json("Failed to send OTP");
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password", async (req, res) => {
  try {
    const normalizedEmail = req.body.email.toLowerCase();
    const { otp, newPassword } = req.body;

    const user = await User.findOne({
      email: normalizedEmail,
      resetOTP: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.json("Password reset successful");
  } catch (err) {
    res.status(500).json("Password reset failed");
  }
});

module.exports = router;
