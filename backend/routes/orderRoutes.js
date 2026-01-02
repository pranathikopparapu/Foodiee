const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

/* ================= AUTH MIDDLEWARE ================= */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("No token");

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
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
      products: req.body.products, // must include foodId
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      totalAmount: req.body.totalAmount,
      status: "Order Placed",
    });

    /* SAVE ADDRESS */
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

    /* RESPOND FAST */
    res.json(order);

    /* ================= USER EMAIL ================= */
    sendEmail(
      user.email,
      "Thanks for ordering with Foodiee 🍔",
      `
Hi ${user.name} 👋,

Thank you for ordering from Foodiee! 🎉

🧾 Order Summary:
${req.body.products
  .map(
    (p, i) =>
      `${i + 1}. ${p.name} x ${p.quantity} = ₹${p.price * p.quantity}`
  )
  .join("\n")}

💰 Total Amount: ₹${req.body.totalAmount}
💳 Payment Method: ${req.body.paymentMethod}

🚚 Your order will be auto-delivered in 5 minutes.

⭐ After delivery, please rate your food:
Profile → My Orders → Write Review

Your feedback helps us improve 
– Team Foodiee 🍔
`
    ).catch(err => console.log("User mail error:", err.message));

    /* ================= ADMIN EMAIL ================= */
    sendEmail(
      process.env.ADMIN_EMAIL,
      "📦 New Order Received – Foodiee",
      `
🚨 NEW ORDER RECEIVED 🚨

👤 Customer: ${user.name}
📧 Email: ${user.email}
📞 Mobile: ${req.body.address.mobile}

🏠 Address:
${req.body.address.flat},
${req.body.address.street},
${req.body.address.pincode}

🧾 Items:
${req.body.products
  .map(
    (p, i) =>
      `${i + 1}. ${p.name} x ${p.quantity} = ₹${p.price * p.quantity}`
  )
  .join("\n")}

💰 Total: ₹${req.body.totalAmount}
💳 Payment: ${req.body.paymentMethod}

📅 Time: ${new Date().toLocaleString()}
`
    ).catch(err => console.log("Admin mail error:", err.message));

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
    !order.deliveryMailSent &&
    now - new Date(order.createdAt).getTime() >= 5 * 60 * 1000
  ) {
    order.status = "Delivered";
    order.deliveryMailSent = true;
    await order.save();

    /* ⭐ DELIVERY + RATING MAIL */
    sendEmail(
      order.userEmail,
      "Your order is delivered ⭐ Rate your food",
      `
Hi ${order.userName},

Your order has been delivered successfully 🍽️

We’d love your feedback!
Go to:
Profile → My Orders → Write Review ⭐

Thanks for choosing Foodiee 💛
`
    ).catch(() => {});
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
/* ================= ADMIN: INCOME + ORDER COUNT ================= */
router.get("/income", auth, async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json("Access denied");
  }

  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const calculateStats = async (startDate) => {
    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    return result.length > 0
      ? {
          income: result[0].totalIncome,
          orders: result[0].totalOrders,
        }
      : { income: 0, orders: 0 };
  };

  res.json({
    today: await calculateStats(startOfToday),
    week: await calculateStats(startOfWeek),
    month: await calculateStats(startOfMonth),
    year: await calculateStats(startOfYear),
  });
});


module.exports = router;
