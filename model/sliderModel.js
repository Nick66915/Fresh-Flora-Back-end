const mongoose = require("mongoose");

const slider = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const Slider = mongoose.model("Slider", slider);
module.exports = Slider;
