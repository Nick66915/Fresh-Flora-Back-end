const mongoose = require("mongoose");

const User = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
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
  password: {
    type: String,
    required: true,
  },
  salt_password: {
    type: String,
    required: true,
  },
  is_active: {
    type: Number,
    default: 1,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    default: 1,
  },
  type: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
});

const user = mongoose.model("user", User);
module.exports = user;
