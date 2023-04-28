const mongoose = require("mongoose");

const deliveryAd = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: false,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const deliveryAddress = mongoose.model("DeliveryAd", deliveryAd);
module.exports = deliveryAddress;
