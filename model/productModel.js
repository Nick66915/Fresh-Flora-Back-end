const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  vendor_id: {
    type: String,
    required: false,
  },
  type: {
    type: Number,
    reuired: true,
  },
  product_name: {
    type: String,
    required: false,
  },
  product_url: {
    type: String,
    required: false,
  },
  categroy_id: {
    type: String,
    required: false,
  },
  sub_categroy_id: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  price: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: false,
  },
  status: {
    type: Number,
    default: 2,
  },
  is_active: {
    type: Number,
    default: 1,
  },
  images: {
    type: String,
    require: true,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("product", productSchema);
