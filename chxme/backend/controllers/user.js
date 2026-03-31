const User = require("../models/user");
const bcrypt = require("bcryptjs"); // will be use for to encrypte the password
const jsonWebToken = require("jsonwebtoken");

/**
 * create a new user and stored in the database and hash the password
 */
exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      userName: req.body.userName,
      password: hash, // no a good optio  req.body.password  //
    });
    // user will be stored on the dazabase mongo at the same
    // will be check the value , user name hast to be uniq
    user
      .save()
      .then((result) => {
        res.status(201).json({ message: "User created", result: result });
      })
      .catch((err) => {
        console.log("this is Error ", err);
        res.status(401).json({
          message: "Invalid authentication by creating credential!",
        });
      });
  });
};

// create the tocken after the user are login
exports.userLogin = (req, res, next) => {
  // check the user name  if the user use a existed  / has to be unique
  let fetchedUser;
  // finding in the data base
  User.findOne({ userName: req.body.userName })
    .then((user) => {
      // console.log(user);
      // check if the user are reated
      if (!user) {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
        });
      }
      fetchedUser = user; // save the user value into avariable
      // compare the password to make sure that the user has used the corrected password
      // by bcrypt it is also posible to compare the entcripte password
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      // console.log("this is the result from user: ", result);
      // check if the comparing value
      if (!result) {
        return res.status(401).json({
          message: "Invalid authetication  credentials! by password",
        });
      }
      // create a jason web  token
      const token = jsonWebToken.sign(
        { userName: fetchedUser.userName, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" } // the token wil expired in one hour
      );
      // console.log(token); // console the token
      res.status(200).json({
        token: token,
        expiresIn: 3600, // seconds
        userId: fetchedUser._id, // get the user id  ro the front
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authetication credentials!",
      });
    });
};
