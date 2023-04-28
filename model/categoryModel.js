const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryUrl: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  is_active: {
    type: Number,
    default: 1,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", categorySchema);
