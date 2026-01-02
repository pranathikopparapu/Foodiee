const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ================= AUTH MIDDLEWARE ================= */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("No token");

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      savedAddresses: [], // ✅ REQUIRED
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ADMIN LOGIN
    if (email === "admin@food.com" && password === "admin123") {
      const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.json({ token, role: "admin", name: "Admin" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: "user",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Hi ${user.name},

Your OTP for password reset is: ${otp}

This OTP is valid for 10 minutes.

Foodiee Team 🍔`
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const otp = req.body.otp.toString();
    const newPassword = req.body.newPassword;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password reset failed" });
  }
});
const Order = require("../models/Order");

/* ================= SYNC ADDRESSES FROM PAST ORDERS ================= */
router.post("/sync-addresses", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const orders = await Order.find({ userId: req.userId });

    if (!user) return res.status(404).json("User not found");

    orders.forEach(order => {
      const addr = order.address;

      const exists = user.savedAddresses.find(a =>
        a.mobile === addr.mobile &&
        a.flat === addr.flat &&
        a.pincode === addr.pincode
      );

      if (!exists) {
        user.savedAddresses.push(addr);
      }
    });

    await user.save();
    res.json(user.savedAddresses);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to sync addresses");
  }
});

/* ================= USER PROFILE ================= */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch {
    res.status(500).json("Failed to fetch profile");
  }
});

/* ================= ADDRESS CRUD ================= */

/* GET ALL ADDRESSES */
router.get("/addresses", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.savedAddresses || []);
});

/* ADD ADDRESS */
router.post("/addresses", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.savedAddresses.push(req.body);
  await user.save();
  res.json(user.savedAddresses);
});

/* UPDATE ADDRESS */
router.put("/addresses/:index", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.savedAddresses[req.params.index] = req.body;
  await user.save();
  res.json(user.savedAddresses);
});

/* DELETE ADDRESS */
router.delete("/addresses/:index", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.savedAddresses.splice(req.params.index, 1);
  await user.save();
  res.json(user.savedAddresses);
});

module.exports = router;
