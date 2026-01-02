const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userEmail: String,
    userName: String,

    products: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    address: {
      name: String,
      mobile: String,
      flat: String,
      street: String,
      pincode: String,
    },

    paymentMethod: String,
    totalAmount: Number,

    status: {
      type: String,
      default: "Order Placed",
    },
    

deliveryMailSent: {
  type: Boolean,
  default: false,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
