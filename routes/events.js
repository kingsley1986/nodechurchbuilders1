const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const fs = require('fs')
const multer  = require('multer')
const path =  require('path')

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
      events: events
    });
  } catch {
    res.redirect('/')
  }
});

router.get('/lives', async (req, res) => {
  try {
    const lives =  await Event.find( { startingDate: { $lt: new Date()} } && { closingDate: { $gt: new Date()} } )
    res.render('events/live', {
      lives: lives
    });
  } catch {
    res.render("events/live", {
      lives: lives
    });
  }
});

// New blogpost routes
router.get('/new', async (req, res, next) => {
  renderNewPage(res, new Event())
});

// Create blogpost routes
router.post('/create', upload.single('cover'), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null
  const event = new Event({
    startingDate: req.body.startingDate,
    closingDate: req.body.closingDate,
    title: req.body.title,
    description: req.body.description,
    eventImage: fileName 
  })
  try {
    console.log(event)
      const events = await event.save()
      res.redirect("/events")
    
    } catch {
      if (event.eventImage != null) {
        removeeventImage(event.eventImage)
    }
      res.render("events/new")
  }
});


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

//Removes unsaved post image
function removeeventImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err =>  {
    if (err) console.log(err)
  })
}

async function renderNewPage(res, event, hasError = false) {
  try {
    const params = {
      event: event
    }
    if (hasError) params.errorMessage = 'Error Creating event'
    res.render('events/new', params)
  } catch {
    res.redirect('/events')
  }
}


module.exports = router;