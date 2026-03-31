// i will implement login und signup user can be able to create and login into the page
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // will be use for to encrypte the password
const jsonWebToken = require("jsonwebtoken");

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.post("/signup/", UserController.createUser);
router.post("/login/", UserController.userLogin);

module.exports = router;
