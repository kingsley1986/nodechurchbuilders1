const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Post = require("../models/post");
const axios = require("axios");
require("dotenv").config();
const fs = require("fs");

router.post("/:postId/comment", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId });
  if (!req.body.token) {
    return res.status(400).json({ error: "reCaptcha token is missing" });
  }

  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}
      &response=${req.body.token}`;

    // console.log(googleVerifyUrl);
    const response = await axios.post(googleVerifyUrl);
    const { success } = response.data;
    if (success) {
      const comment = new Comment();
      comment.description = req.body.description;
      comment.name = req.body.name;
      comment.post = post._id;
      if (req.body.description && req.body.name) {
        await comment.save();

        post.comments.push(comment._id);
        await post.save();

        res.json(post);
      }
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: "Invalid Captcha. Try again." });
    }
  } catch (e) {
    return res.status(400).json({ error: "reCaptcha error." });
  }
});


router.post("/:postId/comment/api", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId });
  if (!req.body.token) {
    return res.status(400).json({ error: "reCaptcha token is missing" });
  }

  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}
      &response=${req.body.token}`;

    // console.log(googleVerifyUrl);
    const response = await axios.post(googleVerifyUrl);
    const { success } = response.data;
    if (success) {
      const comment = new Comment();
      comment.description = req.body.description;
      comment.name = req.body.name;
      comment.post = post._id;
      if (req.body.description && req.body.name) {
        await comment.save();

        post.comments.push(comment._id);
        await post.save();

        res.json(post);
      }
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: "Invalid Captcha. Try again." });
    }
  } catch (e) {
    return res.status(400).json({ error: "reCaptcha error." });
  }
});

router.delete("/comments/:postId/:commentId", async function (req, res) {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { comments: req.params.commentId },
      },
      { new: true }
    );

    if (!post) {
      return res.status(400).send("Post not found");
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
