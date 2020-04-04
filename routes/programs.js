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

// New blogpost routes
router.get('/new', async (req, res, next) => {
    res.render("programs/new");
});

// Create blogpost routes
router.post('/create', upload.single('cover'), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null
     const program = new Program({
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



    //Removes unsaved post image
function removeprogramImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err =>  {
    if (err) console.log(err)
  })
}

module.exports = router;