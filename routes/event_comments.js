const express = require('express')
const router = express.Router()
const Eventcomment = require('../models/event_comment')
const Event = require('../models/event')

const fs = require('fs')

// CREATE Comment
router.post("/:eventId/eventcomment", async(req, res) => {
    const event = await Event.findOne({_id: req.params.eventId});
  
    const event_comment = new Eventcomment();
    event_comment.description = req.body.description;
    event_comment.name = req.body.name;
    event_comment.event = event._id;
    if(req.body.description && req.body.name) {
      await event_comment.save();
  
      event.eventcomments.push(event_comment._id);
      await event.save();
  
      res.json(event);
    }
  });
  

  router.delete("/:eventId/:eventcommentId", async function (req, res) {
    console.log("i have been hitted")
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
