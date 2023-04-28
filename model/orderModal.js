const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
  products: [
    {
      _id: {
        type: String,

        required: true,
      },
      product_name: {
        type: String,
        required: true,
      },
      vendor_id: {
        type: String,
        required: false,
      },
      qty: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: false,
      },
    },
  ],
  user_email: {
    type: String,
    default: false,
  },
  address: {
    type: String,
    default: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    require: false,
  },
  user_type: {
    type: Number,
    default: 1,
  },
  status: {
    type: Number,
    default: 3,
  },
  is_active: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
