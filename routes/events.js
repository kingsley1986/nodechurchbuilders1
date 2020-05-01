const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const fs = require('fs')
const multer  = require('multer')
const path =  require('path')
const sharp = require('sharp');

const uploadPath = path.join('public', Event.eventImageBasePath)
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({ 
  dest: uploadPath,
  fileFilter:  (req, file, callback) => {
    callback(null, imageMineTypes.includes(file.mimetype) )
  }
})


router.get('/', async (req, res) => {
  try {
    const events =  await Event.find({})
    res.render('events/index', {
      events: events, layout: false
    });
  } catch {
    res.redirect('/events')
  }
});


// // Get a single comment  
// router.get("/:id/show", async (req, res) => {
//   const event = await Event.findOne({_id: req.params.id})
//   res.render('events/show',{
//     "event": event
//   });
// })

// Get a Event Wiht comments
router.get("/:id/eventcomments", async (req, res) => {
  const event = await Event.findOne({_id: req.params.id}).populate(
    "eventcomments"
  );
  res.render('events/show',{
    "event": event, layout: false
  });
})

router.get('/lives', async (req, res) => {
  try {
    const lives =  await Event.find( { startingDate: { $lt: new Date()} } && { closingDate: { $gt: new Date()} } )
    res.render('events/live', {
      lives: lives, layout: false
    });
  } catch {
    res.redirect("/events");
  }
});

router.get('/upcomingevents', async (req, res) => {
  try {
    const upcomingevents =  await Event.find( { startingDate: { $gt: new Date()} })
    res.render('events/upcomings', {
      upcomingevents: upcomingevents, layout: false
    });
  } catch {
    res.redirect("/events");
  }
});

router.get('/pastevents', async (req, res) => {
  try {
    const pastevents =  await Event.find( { closingDate: { $lt: new Date()} })
    res.render('events/pastevents', {
      pastevents: pastevents, layout: false
    });
  } catch {
    res.redirect("/events");
  }
});

// New events routes
router.get('/new', async (req, res, next) => {
  renderNewPage(res, new Event())
});


// Create Events routes
router.post('/create', upload.single('eventImage'), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null
 
  const event = new Event({
    startingDate: req.body.startingDate,
    closingDate: req.body.closingDate,
    title: req.body.title,
    description: req.body.description,
    eventImage: fileName 
  })
  try {    
    const events = await event.save()
      res.redirect("/events")
    
    } catch {
      if (event.eventImage != null) {
        removeeventImage(event.eventImage)
    }
      res.redirect("back")
  }
});

//Deleting an event
router.delete( '/:id', function( req, res ){
  const ObjectId = mongoose.Types.ObjectId;

  let query = {_id:new ObjectId(req.params.id)}

  Event.deleteOne(query, function(err) {
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
})

router.get("/edit/:id", async (req, res) => {
  Event.findById(req.params.id, function(err, event) {
    if (!event) {
      return next(new Error('Could not load Document'));
    }else {
      res.render('events/edit',{
        "event": event, layout: false
      });
    }
  });
});

router.post('/edit/:id', upload.single('eventImage'), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null
  console.log(req.body)
   let event = {};
   event.title = req.body.title;
   event.description = req.body.description;
   event.eventImage = fileName
   event.startingDate = req.body.startingDate
   event.closingDate = req.body.closingDate
   let query = {_id: req.params.id}
    Event.updateOne(query, event,  (err, event) => {
     if(err){
       console.log(err)
       res.redirect("back");
     }else {
      res.redirect("/events");
     }
   });
 });


//Removes unsaved post image
function removeeventImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err =>  {
    if (err) console.log(err)
  })
}

async function renderNewPage(res, event, hasError = false) {
  try {
    const params = {
      event: event, layout: false
    }
    if (hasError) params.errorMessage = 'Error Creating event'
    res.render('events/new', params)
  } catch {
    res.redirect('/events')
  }
}


router.get("/:id/going", async (req, res, next) => {
  Event.findById(req.params.id, function(err, event) {
    console.log("kdjkfdjkfdkj")
    if (!event) {
      return next(new Error('Could not load Document'));
    }else {
      event.going += 1;
      event.save();
      res.render("success")
    }
  });
});

router.post("/:id/coming_with", async (req, res, next) => {
Event.findByIdAndUpdate({_id: req.params.id}, {$inc: { coming_with: req.body.coming_with} }, function(error, event)   {
  console.log(event)
  if(error) {
    console.log(error)
    res.render("events/show", {
      event: event,
    });
  } else {
    res.render("events/show", {
      event: event, layout: false
    });
  }
});
});

module.exports = router;