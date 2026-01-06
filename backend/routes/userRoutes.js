const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

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
  } catch {
    return res.status(401).json("Invalid token");
  }
};

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars, include uppercase, lowercase, number & special character",
      });
    }

    const normalizedEmail = email.toLowerCase();
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
      cart: [],
      wishlist: [],
      savedAddresses: [],
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json("Invalid credentials");

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

/* ================= PROFILE ================= */
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch {
    res.status(500).json("Failed to fetch profile");
  }
});

/* ================= WISHLIST ================= */

// GET wishlist
router.get("/wishlist", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.wishlist || []);
});

// ADD wishlist
router.post("/wishlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.wishlist) user.wishlist = [];

    const exists = user.wishlist.find(
      (i) => i.foodId && i.foodId.toString() === req.body.foodId
    );

    if (!exists) {
      user.wishlist.push(req.body);
      await user.save();
    }

    res.json(user.wishlist);
  } catch (err) {
    console.error("ADD WISHLIST ERROR:", err);
    res.status(500).json("Failed to add to wishlist");
  }
});

// REMOVE wishlist
router.delete("/wishlist/:foodId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.wishlist = (user.wishlist || []).filter(
      (i) => i.foodId && i.foodId.toString() !== req.params.foodId
    );
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    console.error("REMOVE WISHLIST ERROR:", err);
    res.status(500).json("Failed to remove from wishlist");
  }
});

/* ================= CART ================= */

// GET cart
router.get("/cart", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.cart || []);
});

// ADD to cart
router.post("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.cart) user.cart = [];

    const exists = user.cart.find(
      (item) => item.foodId && item.foodId.toString() === req.body.foodId
    );

    if (exists) {
      exists.quantity += 1;
    } else {
      user.cart.push({ ...req.body, quantity: 1 });
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error("ADD CART ERROR:", err);
    res.status(500).json("Failed to add to cart");
  }
});

// REMOVE from cart
router.delete("/cart/:foodId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = (user.cart || []).filter(
      (item) => item.foodId && item.foodId.toString() !== req.params.foodId
    );
    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json("Failed to remove cart item");
  }
});

// INCREASE QTY
router.put("/cart/increase/:foodId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const item = (user.cart || []).find(
      (i) => i.foodId && i.foodId.toString() === req.params.foodId
    );

    if (item) item.quantity += 1;
    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error("INCREASE CART ERROR:", err);
    res.status(500).json("Failed to increase cart item");
  }
});

// DECREASE QTY
router.put("/cart/decrease/:foodId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const item = (user.cart || []).find(
      (i) => i.foodId && i.foodId.toString() === req.params.foodId
    );

    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        user.cart = user.cart.filter(
          (i) => i.foodId && i.foodId.toString() !== req.params.foodId
        );
      }
      await user.save();
    }

    res.json(user.cart);
  } catch (err) {
    console.error("DECREASE CART ERROR:", err);
    res.status(500).json("Failed to decrease cart item");
  }
});

// CLEAR cart
router.delete("/cart", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.cart = [];
  await user.save();
  res.json([]);
});

/* ================= MAKE ADMIN ================= */
router.put("/make-admin/:id", auth, async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json("Access denied");
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json("User not found");

  user.role = "admin";
  await user.save();

  res.json("User promoted to admin");
});
/* ================= USER ADDRESSES ================= */
router.get("/addresses", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.savedAddresses || []);
  } catch (err) {
    console.error("FETCH ADDRESSES ERROR:", err);
    res.status(500).json("Failed to fetch addresses");
  }
});


module.exports = router;
