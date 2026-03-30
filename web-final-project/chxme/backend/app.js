const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongooes = require("mongoose");
const postsRouters = require("./routes/posts");
const userRouters = require("./routes/user");
const app = express();

/*
 *here connect to mongodb conected to  the test db

 */
mongooes
  .connect(
    "mongodb+srv://ToviasNunez:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.ja7l1rr.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
/**
 * to handle the error from security
 * when we want to connect to the server
 * that have diferent port and address
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept , Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// filter to reques go to this roue /api/posts
app.use("/api/posts", postsRouters);
app.use("/api/user", userRouters);

module.exports = app;
