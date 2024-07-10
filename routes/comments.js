const express = require("express");
const router = express.Router();
const comments = require("../data/comments");
const error = require("../utilities/error");

// GET all comments
router.get("/", (req, res) => {
  let result = comments;
  if (req.query.userId) {
    result = comments.filter(comment => comment.userId == req.query.userId);
  } else if (req.query.postId) {
    result = comments.filter(comment => comment.postId == req.query.postId);
  }
  res.json(result);
});

// POST a new comment
router.post("/", (req, res, next) => {
  if (req.body.userId && req.body.postId && req.body.body) {
    const comment = {
      id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
      userId: req.body.userId,
      postId: req.body.postId,
      body: req.body.body,
    };
    comments.push(comment);
    res.json(comment);
  } else next(error(400, "Insufficient Data"));
});

// GET comment by id
router.get("/:id", (req, res, next) => {
  const comment = comments.find(comment => comment.id == req.params.id);
  if (comment) res.json(comment);
  else next();
});

// PATCH comment by id
router.patch("/:id", (req, res, next) => {
  const comment = comments.find((comment, index) => {
    if (comment.id == req.params.id) {
      for (const key in req.body) {
        comments[index][key] = req.body[key];
      }
      return true;
    }
  });
  if (comment) res.json(comment);
  else next();
});

// DELETE comment by id
router.delete("/:id", (req, res, next) => {
  const index = comments.findIndex(comment => comment.id == req.params.id);
  if (index !== -1) {
    const deleted = comments.splice(index, 1);
    res.json(deleted[0]);
  } else next();
});

// GET comments by user id
router.get("/user/:userId", (req, res) => {
  const userComments = comments.filter(comment => comment.userId == req.params.userId);
  res.json(userComments);
});

// GET comments by post id
router.get("/post/:postId", (req, res) => {
  const postComments = comments.filter(comment => comment.postId == req.params.postId);
  res.json(postComments);
});

// GET comments by user id on a specific post
router.get("/post/:postId/user/:userId", (req, res) => {
  const filteredComments = comments.filter(
    comment => comment.postId == req.params.postId && comment.userId == req.params.userId
  );
  res.json(filteredComments);
});

// GET comments by post id for a specific user
router.get("/user/:userId/post/:postId", (req, res) => {
  const filteredComments = comments.filter(
    comment => comment.userId == req.params.userId && comment.postId == req.params.postId
  );
  res.json(filteredComments);
});

module.exports = router;
