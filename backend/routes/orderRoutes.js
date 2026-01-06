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

    /* ✅ CLEAN PRODUCTS */
    const cleanProducts = (req.body.products || []).filter(
      (p) => p.foodId && p.quantity > 0
    );

    if (!cleanProducts.length) {
      return res.status(400).json("Cart is empty");
    }

    /* ✅ VALIDATE ADDRESS */
    const address = req.body.address;
    if (
      !address ||
      !address.mobile ||
      !address.flat ||
      !address.pincode
    ) {
      return res.status(400).json("Invalid address");
    }

    const order = await Order.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      products: cleanProducts,
      address,
      paymentMethod: req.body.paymentMethod,
      totalAmount: req.body.totalAmount,
      status: "Order Placed",
    });

    /* ✅ SAVE ADDRESS SAFELY */
    const exists = user.savedAddresses.find(
      (a) =>
        a.mobile === address.mobile &&
        a.flat === address.flat &&
        a.pincode === address.pincode
    );

    if (!exists) {
      user.savedAddresses.push(address);
    }

    /* ✅ CLEAR CART AFTER ORDER */
    user.cart = [];
    await user.save();

    /* RESPOND FAST */
    res.json(order);

    /* ================= EMAILS (UNCHANGED) ================= */
    sendEmail(
      user.email,
      "Thanks for ordering with Foodiee 🍔",
      `
Hi ${user.name} 👋,

Thank you for ordering from Foodiee! 🎉

🧾 Order Summary:
${cleanProducts
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

– Team Foodiee 🍔
`
    ).catch(() => {});

    sendEmail(
      process.env.BREVO_SENDER_EMAIL,
      "📦 New Order Received – Foodiee",
      `
🚨 NEW ORDER RECEIVED 🚨

👤 Customer: ${user.name}
📧 Email: ${user.email}
📞 Mobile: ${address.mobile}

🏠 Address:
${address.flat},
${address.street},
${address.pincode}

🧾 Items:
${cleanProducts
  .map(
    (p, i) =>
      `${i + 1}. ${p.name} x ${p.quantity} = ₹${p.price * p.quantity}`
  )
  .join("\n")}

💰 Total: ₹${req.body.totalAmount}
💳 Payment: ${req.body.paymentMethod}

📅 Time: ${new Date().toLocaleString()}
`
    ).catch(() => {});
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
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

        /* ⭐ DELIVERY + RATING MAIL (USER ONLY) */
        sendEmail(
          order.userEmail,
          "Your order is delivered ⭐ Rate your food",
          `
Hi ${order.userName},

Your order has been delivered successfully 🍽️

Please rate & review:
Profile → My Orders → Write Review ⭐

– Team Foodiee 🍔
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
// GET CART
router.get("/cart", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.cart || []);
});

// ADD TO CART
router.post("/cart", auth, async (req, res) => {
  const user = await User.findById(req.userId);

  const item = user.cart.find(
    i => i.foodId.toString() === req.body.foodId
  );

  if (item) {
    item.quantity += 1;
  } else {
    user.cart.push({ ...req.body, quantity: 1 });
  }

  await user.save();
  res.json(user.cart);
});

// REMOVE FROM CART
router.delete("/cart/:foodId", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.cart = user.cart.filter(
    i => i.foodId.toString() !== req.params.foodId
  );
  await user.save();
  res.json(user.cart);
});
/* ================= INCREASE CART QTY ================= */
router.put("/cart/increase/:foodId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const item = user.cart.find(
      (i) => i.foodId.toString() === req.params.foodId
    );

    if (!item) {
      return res.status(404).json("Item not found in cart");
    }

    item.quantity += 1;
    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error("INCREASE QTY ERROR:", err);
    res.status(500).json("Failed to increase quantity");
  }
});

/* ================= DECREASE CART QTY ================= */
router.put("/cart/decrease/:foodId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const item = user.cart.find(
      (i) => i.foodId.toString() === req.params.foodId
    );

    if (!item) {
      return res.status(404).json("Item not found in cart");
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error("DECREASE QTY ERROR:", err);
    res.status(500).json("Failed to decrease quantity");
  }
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
