const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

/* ================= AUTH ================= */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("No token");

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch {
    return res.status(401).json("Invalid token");
  }
};

/* ================= CREATE ORDER ================= */
router.post("/create", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const order = await Order.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      products: req.body.products,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      totalAmount: req.body.totalAmount,
      status: "Order Placed",
    });

    // save address
    const exists = user.savedAddresses.find(
      a =>
        a.mobile === req.body.address.mobile &&
        a.flat === req.body.address.flat &&
        a.pincode === req.body.address.pincode
    );
    if (!exists) {
      user.savedAddresses.push(req.body.address);
      await user.save();
    }

    res.json(order);

    // emails (non-blocking)
    sendEmail(
      user.email,
      "Order Confirmed 🎉",
      `Hi ${user.name},

Your order of ₹${req.body.totalAmount} has been placed successfully.

It will be auto-delivered in 5 minutes.`
    ).catch(() => {});

    sendEmail(
      process.env.ADMIN_EMAIL,
      "New Order 📦",
      `Customer: ${user.name}
Total: ₹${req.body.totalAmount}`
    ).catch(() => {});
  } catch (err) {
    console.error(err);
    res.status(500).json("Order failed");
  }
});

/* ================= USER: MY ORDERS (AUTO DELIVERY) ================= */
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    const now = Date.now();

    for (const order of orders) {
      if (
        order.status === "Order Placed" &&
        now - new Date(order.createdAt).getTime() >= 5 * 60 * 1000
      ) {
        order.status = "Delivered";
        await order.save();
      }
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to fetch orders");
  }
});

/* ================= ADMIN: ALL ORDERS ================= */
router.get("/all", auth, async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json("Access denied");
  }

  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
