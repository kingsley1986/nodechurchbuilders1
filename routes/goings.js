const express = require('express')
const router = express.Router()
const Going = require('../models/going')
const Event = require('../models/event')

const fs = require('fs')

// CREATE Comment
router.get("/:id/going", async(req, res) => {
    const event = await Event.findOne({_id: req.params.id});
  console.log(event)
    const going = new Going();
    going.yes = req.body.yes =+ 1;
    going.event = event._id;
    if(req.body.yes ) {
      await going.save();
  
      event.goings.push(going._id);
      await event.save();
  
      res.redirect('back');
    }else{
      res.redirect('back')
    }
  });
  

  

  
module.exports = router;
