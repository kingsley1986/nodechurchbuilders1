const express = require('express')
const router = express.Router()
const Program = require('../models/program')
const fs = require('fs')
const multer  = require('multer')
const path =  require('path')

const uploadPath = path.join('public', Program.programImageBasePath)
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({ 
  dest: uploadPath,
  fileFilter:  (req, file, callback) => {
    callback(null, imageMineTypes.includes(file.mimetype) )
  }
})


router.get('/', async (req, res) => {
  try {
    const programs =  await Program.find({})
    res.render('programs/index', {
      programs: programs
    });
  } catch {
    res.redirect('/')
  }
});


router.get('/:id', async (req, res) => {
  try {
    const program =  await Program.findById(req.params.id)
    res.render('programs/show', {
      program: program
    });
  } catch {
    res.redirect('/params')
  }
});

// New blogpost routes
router.get('/new', async (req, res, next) => {
    res.render("programs/new");
});

// Create blogpost routes
router.post('/create', upload.single('cover'), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null
  const program = new Program({
    programtype: req.body.programtype,
    title: req.body.title,
    description: req.body.description,
    programImage: fileName 
  })
  try {
    console.log(program)
      const programs = await program.save()
      res.redirect("/programs")
    
    } catch {
      if (program.programImage != null) {
        removeprogramImage(program.programImage)
    }
      res.render("programs/new")
  }
});


router.delete( '/:id', function( req, res ){
  const ObjectId = mongoose.Types.ObjectId;

  let query = {_id:new ObjectId(req.params.id)}

  Program.deleteOne(query, function(err) {
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
})



    //Removes unsaved post image
function removeprogramImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err =>  {
    if (err) console.log(err)
  })
}


global.ACTIVITIES = ["Youths", "Children"]
module.exports = router;