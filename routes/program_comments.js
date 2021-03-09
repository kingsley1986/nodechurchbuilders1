const express = require("express");
const router = express.Router();
const Programcomment = require("../models/program_comment");
const Program = require("../models/program");
const axios = require("axios");
require("dotenv").config();

const fs = require("fs");

// CREATE Comment
router.post("/:programId/createcommentapi", async (req, res) => {
  const program = await Program.findOne({ _id: req.params.programId });
  if (!req.body.token) {
    return res.status(400).json({ error: "reCaptcha token is missing" });
  }

  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}
    &response=${req.body.token}`;

    const response = await axios.post(googleVerifyUrl);
    const { success } = response.data;
    if (success) {
      console.log("google response with success ");
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
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: "Invalid Captcha. Try again." });
    }
  } catch (e) {
    return res.status(400).json({ error: "reCaptcha error." });
  }
});

router.post("/:programId/createcommentapi", async (req, res) => {
  const program = await Program.findOne({ _id: req.params.programId });

  const programComment = new Programcomment();
  programComment.description = req.body.description;
  programComment.name = req.body.name;
  programComment.program = program._id;
  if (req.body.description && req.body.name) {
    await programComment.save();

    program.programcomments.push(programComment._id);
    await program.save();

    res.redirect("back");
  } else {
    res.redirect("back");
  }
});

router.delete("/:programId/:programcommentId", async function (req, res) {
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
