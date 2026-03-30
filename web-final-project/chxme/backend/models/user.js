// mongoose user model the user has to be unique value

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// this is the bluePrint that identified the user
const userSchema = mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// uniqueValidator validate if the value is unique
userSchema.plugin(uniqueValidator); // data before save  on the dbs
module.exports = mongoose.model("User", userSchema); 
