const express = require("express");
const router = express.Router();
const Eventcomment = require("../models/event_comment");
const Event = require("../models/event");
require("dotenv").config();
const axios = require("axios");

const fs = require("fs");

// // CREATE Comment
// router.post("/:eventId/eventcomment", async (req, res) => {
//   const event = await Event.findOne({ _id: req.params.eventId });

//   const event_comment = new Eventcomment();
//   event_comment.description = req.body.description;
//   event_comment.name = req.body.name;
//   event_comment.event = event._id;
//   if (req.body.description && req.body.name) {
//     await event_comment.save();

//     event.eventcomments.push(event_comment._id);
//     await event.save();

//     res.json(event);
//   }
// });

// CREATE Comment
router.post("/:eventId/eventcomment", async (req, res) => {
  const event = await Event.findOne({ _id: req.params.eventId });
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
      const event_comment = new Eventcomment();
      event_comment.description = req.body.description;
      event_comment.name = req.body.name;
      event_comment.event = event._id;
      if (req.body.description && req.body.name) {
        await event_comment.save();

        event.eventcomments.push(event_comment._id);
        await event.save();

        res.json(event);
      }
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: "Invalid Captcha. Try again." });
    }
  } catch (e) {
    return res.status(400).json({ error: "reCaptcha error." });
  }
});

router.delete("/:eventId/:eventcommentId", async function (req, res) {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      {
        $pull: { eventcomments: req.params.eventcommentId },
      },
      { new: true }
    );

    if (!event) {
      return res.status(400).send("Event not found");
    }

    await Eventcomment.findByIdAndDelete(req.params.eventcommentId);

    res.send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
