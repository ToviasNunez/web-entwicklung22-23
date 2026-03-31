// check if are authenticate  or not (when the user are loged )
// verified the generated  token that was created

const jsonWebToken = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "You are not authenticated!" });
    }
    const token = authHeader.split(" ")[1]; // get the token that was create on the header

    // verified and decoded the token
    const decodedToken = jsonWebToken.verify(token, process.env.JWT_KEY);
    // console.log(decodedToken);console  the decode token
    // add new request field that will be use for for to call the user id  and email
    req.userData = {
      userName: decodedToken.userName,
      userId: decodedToken.userId,
    }; // accessing this req to the post router
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
