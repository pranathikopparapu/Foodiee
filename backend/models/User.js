const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  flat: String,
  street: String,
  pincode: String,
});

const wishlistSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  name: String,
  price: Number,
  image: String,
  category: String,
});


const cartSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  name: String,
  price: Number,
  image: String,
  quantity: Number,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },

  cart: [cartSchema],          // ⭐ ADD THIS
  wishlist: [wishlistSchema],  // already present
  savedAddresses: [addressSchema],
});



module.exports = mongoose.model("User", userSchema);
