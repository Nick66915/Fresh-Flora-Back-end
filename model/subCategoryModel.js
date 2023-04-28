const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
  category_id: {
    type: String,
    required: true,
  },
  sub_category_name: {
    type: String,
    required: true,
  },
  sub_category_url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  is_active: {
    type: Number,
    default: 1,
  },
  cretae_date: {
    type: Date,
  },
});

module.exports = mongoose.model("subCategory", subCategorySchema);
