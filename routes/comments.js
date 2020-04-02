const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')
const Post = require('../models/post')

const fs = require('fs')

// CREATE Comment
router.post("/posts/:postId/comment", async(req, res) => {
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
  


  
module.exports = router;
