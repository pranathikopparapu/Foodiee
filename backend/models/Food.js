const mongoose = require("mongoose");

/* ================= REVIEW SCHEMA ================= */
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/* ================= FOOD SCHEMA ================= */
const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },

    available: {
      type: Boolean,
      default: true,
    },

    /* ⭐ REVIEWS */
    reviews: [reviewSchema],

    /* ⭐ AVG RATING */
    avgRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ================= AUTO CALCULATE AVG RATING ================= */
foodSchema.methods.calculateAvgRating = function () {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
  } else {
    const total = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.avgRating = Number((total / this.reviews.length).toFixed(1));
  }
};

module.exports = mongoose.model("Food", foodSchema);
