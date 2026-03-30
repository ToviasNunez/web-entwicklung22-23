const Post = require("../models/post"); // bluePrint

/**
 * creating a post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    country: req.body.country,
    city: req.body.city,
    topic: req.body.topic,
    rate: req.body.rate,
    imagePath: url + "/images/" + req.file.filename,
    content: req.body.content,
    subtitel: req.body.subtitel,
    date: req.body.date,
    creator: req.userData.userId,
    author: req.userData.userName, // get the user id from the token using decode from the middleware
  });

  post
    .save()
    .then((createdPost) => {
      console.log(createdPost);
      res.status(201).json({
        message: "post added successfully",
        post: {
          ...createdPost, // this overwrite the object from the post
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Creating a post failed" });
    });
  //console.log(post)
};

/**
 * fetching the post
 */
exports.getPost = (req, res, next) => {
  const pageSize = +req.query.pagesize; // + convert into number
  const currentPage = +req.query.page;
  const postQuery = Post.find(); // extracting query
  let fetchedPost;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  // return the count from the post
  postQuery
    .then((documents) => {
      fetchedPost = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Post fetched succesfully ",
        posts: fetchedPost,
        maxPost: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching post failed" });
    });
};

// getting the post from the id in the databs
exports.getPostFromId = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not Found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching post failed" });
    });
};

// updating the post
exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    country: req.body.country,
    city: req.body.city,
    topic: req.body.topic,
    rate: req.body.rate,
    imagePath: imagePath,
    content: req.body.content,
    subtitel: req.body.subtitel,
    date: req.body.date,
    creator: req.userData.userId,
    author: req.userData.userName,
  });

  //console.log(post);
  /** make sure that the user id math with the loged user id req.userData.userId
   * it is required for to update the post
   * */
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      //  console.log(result);
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update successsful" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
      //console.log("this is the result after update" + result);
    })
    .catch((error) => {
      res.status(500).join({ message: "Couldn't update the post!" });
    });
};

/**
 * deleting post usisng the dynamic id
 * only authorized user (creator) can delete the post
 */
exports.deletePost = (req, res, next) => {
  //console.log(req.params.id)
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      // console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post deleted" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching post failed" });
    });
};
