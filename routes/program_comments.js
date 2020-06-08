const express = require('express')
const router = express.Router()
const Programcomment = require('../models/program_comment')
const Program = require('../models/program')

const fs = require('fs')

// CREATE Comment
router.post("/:programId/programcomment", async(req, res) => {
    const program = await Program.findOne({_id: req.params.programId});
  
    const programComment = new Programcomment();
    programComment.description = req.body.description;
    programComment.name = req.body.name;
    programComment.program = program._id;
    if(req.body.description && req.body.name) {
      await programComment.save();
  
      program.programcomments.push(programComment._id);
      await program.save();
  
      res.redirect('back');
    }else{
      res.redirect('back')
    }
  });

  

  // router.delete("/comments/:postId/:commentId", async function (req, res) {
  //   try {
  //     const post = await Post.findByIdAndUpdate(
  //       req.params.postId,
  //       {
  //         $pull: { comments: req.params.commentId },
  //       },
  //       { new: true }
  //     );
  
  //     if (!post) {
  //       return res.status(400).send("Post not found");
  //     }
  
  //     await Comment.findByIdAndDelete(req.params.commentId);
  
  //     res.send("Success");
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send("Something went wrong");
  //   }
  // });


  
module.exports = router;
