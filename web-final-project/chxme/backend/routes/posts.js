const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const PostControllers = require("../controllers/posts");

/**
 * router a new post and check if all parameter are validated
 * save the post
 */
router.post("", checkAuth, extractFile, PostControllers.createPost);

/**
 * fetching the post
 */
router.get("", PostControllers.getPost);
router.get("/:id", PostControllers.getPostFromId);

/**
 *
 * // updating the post using the id
 * only authorized user (creator) can update the post
 * make sure only user that create post be able edited
 */
router.put("/:id", checkAuth, extractFile, PostControllers.updatePost);

router.delete("/:id", checkAuth, PostControllers.deletePost);

// export this module that can be use
module.exports = router;
