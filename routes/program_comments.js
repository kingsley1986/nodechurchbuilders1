const express = require("express");
const router = express.Router();
const Programcomment = require("../models/program_comment");
const Program = require("../models/program");

const fs = require("fs");

// CREATE Comment
router.post("/:programId/programcomment", async (req, res) => {
  const program = await Program.findOne({ _id: req.params.programId });

  const programComment = new Programcomment();
  programComment.description = req.body.description;
  programComment.name = req.body.name;
  programComment.program = program._id;
  if (req.body.description && req.body.name) {
    await programComment.save();

    program.programcomments.push(programComment._id);
    await program.save();

    res.json(program);
  }
});

router.delete("/:programId/:programcommentId", async function (req, res) {
  console.log("i have been hitted");
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.programId,
      {
        $pull: { programcomments: req.params.programcommentId },
      },
      { new: true }
    );

    if (!program) {
      return res.status(400).send("Post not found");
    }

    await Programcomment.findByIdAndDelete(req.params.programcommentId);

    res.send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
