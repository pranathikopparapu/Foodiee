const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

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
    res.status(401).json("Invalid token");
  }
};

/* ================= ADMIN MIDDLEWARE ================= */
const adminOnly = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json("Admin access only");
  }
  next();
};

/* ================= ADD FOOD (ADMIN) ================= */
router.post("/add", auth, adminOnly, async (req, res) => {
  try {
    const { name, category, price, image, available } = req.body;

    const food = await Food.create({
      name,
      category,
      price,
      image,
      available,
      reviews: [],
      avgRating: 0,
    });

    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to add food");
  }
});

/* ================= GET ALL FOOD ================= */
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch {
    res.status(500).json("Failed to fetch foods");
  }
});

/* ================= UPDATE FOOD (ADMIN) ================= */
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFood);
  } catch {
    res.status(500).json("Failed to update food");
  }
});

/* ================= DELETE FOOD (ADMIN) ================= */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json("Food deleted");
  } catch {
    res.status(500).json("Failed to delete food");
  }
});

/* ================= ADD REVIEW (USER) ================= */
router.post("/:id/review", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const foodId = req.params.id;

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json("Food not found");

    /* ✅ CHECK: USER ORDERED THIS FOOD AND IT IS DELIVERED */
    const order = await Order.findOne({
      userId: req.userId,
      status: "Delivered",
      "products.foodId": foodId,
    });

    if (!order) {
      return res.status(403).json("Only delivered buyers can review");
    }

    /* ❌ PREVENT DUPLICATE REVIEW */
    const alreadyReviewed = food.reviews.find(
      (r) => r.userId.toString() === req.userId
    );

    if (alreadyReviewed) {
      return res.status(400).json("You already reviewed this product");
    }

    /* ⭐ ADD REVIEW */
    food.reviews.push({
      userId: req.userId,
      userName: order.userName,
      rating,
      comment,
    });

    /* ⭐ AUTO CALCULATE AVG RATING */
    food.calculateAvgRating();
    await food.save();

    res.json({
      avgRating: food.avgRating,
      reviews: food.reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Review failed");
  }
});

/* ================= GET REVIEWS ================= */
router.get("/:id/reviews", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.json({
      avgRating: food.avgRating,
      reviews: food.reviews,
    });
  } catch {
    res.status(500).json("Failed to fetch reviews");
  }
});

module.exports = router;
