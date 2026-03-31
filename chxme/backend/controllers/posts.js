require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const Post = require("../models/post");
const demoPosts = require("../demo/demo-posts");

const isDemoMode = process.env.DEMO_MODE === "true";

/**
 * Create a post
 */
exports.createPost = (req, res, next) => {
  if (isDemoMode) {
    return res.status(403).json({
      message: "Creating posts is disabled in demo mode",
    });
  }

  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    country: req.body.country,
    city: req.body.city,
    topic: req.body.topic,
    rate: req.body.rate,
    imagePath: req.file ? url + "/images/" + req.file.filename : null,
    content: req.body.content,
    subtitel: req.body.subtitel,
    date: req.body.date,
    creator: req.userData.userId,
    author: req.userData.userName,
  });

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost._doc,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed",
      });
    });
};

/**
 * Get all posts
 */
exports.getPost = (req, res, next) => {
  if (isDemoMode) {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;

    let posts = [...demoPosts];

    if (pageSize && currentPage) {
      const startIndex = pageSize * (currentPage - 1);
      const endIndex = startIndex + pageSize;
      posts = posts.slice(startIndex, endIndex);
    }

    return res.status(200).json({
      message: "Demo posts fetched successfully",
      posts: posts,
      maxPost: demoPosts.length,
    });
  }

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPost = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPost,
        maxPost: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed",
      });
    });
};

/**
 * Get a single post by id
 */
exports.getPostFromId = (req, res, next) => {
  if (isDemoMode) {
    const post = demoPosts.find(
      (p) => p._id === req.params.id || p.id === req.params.id
    );

    if (post) {
      return res.status(200).json(post);
    }

    return res.status(404).json({
      message: "Post not found!",
    });
  }

  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post not found!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed",
      });
    });
};

/**
 * Update a post
 */
exports.updatePost = (req, res, next) => {
  if (isDemoMode) {
    return res.status(403).json({
      message: "Updating posts is disabled in demo mode",
    });
  }

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

  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  )
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "Update successful",
        });
      } else {
        res.status(401).json({
          message: "Not authorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update the post!",
      });
    });
};

/**
 * Delete a post
 */
exports.deletePost = (req, res, next) => {
  if (isDemoMode) {
    return res.status(403).json({
      message: "Deleting posts is disabled in demo mode",
    });
  }

  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Post deleted",
        });
      } else {
        res.status(401).json({
          message: "Not authorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting post failed",
      });
    });
};
