// create a post model using mongoose database

const mongoose = require("mongoose");

// this is the bluePrint that identified the post
const postSchema = mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  topic: { type: String, required: true },
  rate: { type: Number, required: true },
  imagePath: { type: String, required: true },
  subtitel: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  author: { type: String, required: true },
});

module.exports = mongoose.model("Post", postSchema);
