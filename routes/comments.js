const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')
const Post = require('../models/post')

const fs = require('fs')

// CREATE Comment
router.post("/:postId/comment", async(req, res) => {
    const post = await Post.findOne({_id: req.params.postId});
  
    const comment = new Comment();
    comment.description = req.body.description;
    comment.name = req.body.name;
    comment.post = post._id;
    if(req.body.description && req.body.name) {
      await comment.save();
  
      post.comments.push(comment._id);
      await post.save();
  
      res.redirect('back');
    }else{
      res.redirect('back')
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
