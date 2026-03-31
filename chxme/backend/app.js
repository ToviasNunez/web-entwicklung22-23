require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

mongoose.set("strictQuery", false);

const postsRouters = require("./routes/posts");
const userRouters = require("./routes/user");

const app = express();
const isDemoMode = process.env.DEMO_MODE === "true";

if (!isDemoMode) {
  mongoose
    .connect(
      "mongodb+srv://ToviasNunez:" +
        process.env.MONGO_ATLAS_PW +
        "@cluster0.ja7l1rr.mongodb.net/test?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((error) => {
      console.log("Connection failed!", error);
    });
} else {
  console.log("Running in DEMO_MODE. MongoDB connection skipped.");
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use(cors({ origin: 'https://toviasnunez.github.io' }));

app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:4200"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRouters);
app.use("/api/user", userRouters);

module.exports = app;
