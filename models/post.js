const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the image path as a string
  },
  user: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);
