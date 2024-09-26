// models/sample.js
const mongoose = require("mongoose");

const PaginationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Pagination", PaginationSchema);
