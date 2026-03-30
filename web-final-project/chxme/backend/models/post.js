// create a post model using mongoose database

const mongoose = require("mongoose");

// this is the bluePrint that identified the post
const postSchema = mongoose.Schema({
  country: { type: String, require: true },
  city: { type: String, require: true },
  topic: { type: String, require: true },
  rate: { type: Number, require: true },
  imagePath: { type: String, require: true },
  subtitel: { type: String, require: true },
  content: { type: String, require: true },
  date: { type: String, require: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  author: { type: mongoose.Schema.Types.String, ref: "User", require: true }, // ref allow to wich modul this id was stored
});

module.exports = mongoose.model("Post", postSchema);
