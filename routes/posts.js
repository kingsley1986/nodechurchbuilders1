const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const fs = require('fs')
const multer  = require('multer')
const path =  require('path')

const uploadPath = path.join('public', Post.postImageBasePath)
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({ 
  dest: uploadPath,
  fileFilter:  (req, file, callback) => {
    callback(null, imageMineTypes.includes(file.mimetype) )
  }
})

// Get all Blog posts
router.get('/', async (req, res) => {
  try {
    const posts =  await Post.find({})
    res.render('posts/index', {
      posts: posts
    });
  } catch {
    res.redirect('/')
  }
});

// New blogpost routes
router.get('/new', async (req, res, next) => {
  renderNewPage(res, new Post())
});

// Create blogpost routes
router.post('/', upload.single('cover'), async (req, res, next) => {
 const fileName = req.file != null ? req.file.filename : null

  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    from: req.body.from,
    postImage: fileName

  })
  try {
    const newPost = await post.save()
    res.redirect('/posts')

  } catch {
    if (post.postImage != null) {
      removePostImage(post.postImage)
    }
    renderNewPage(res, post, true)
  }
});

// Get a post Wiht comments
router.get("/:id/comments", async (req, res) => {
  const post = await Post.findOne({_id: req.params.id}).populate(
    "comments"
  );
  res.render('posts/show',{
    "post": post
  });
})

router.get("/:id/edit", async (req, res) => {
  Post.findById(req.params.id, function(err, post) {
    if (!post) {
      return next(new Error('Could not load Document'));
    }else {
      res.render('posts/edit',{
        "post": post
      });
    }
  });
});

router.post("/:id", function(req, res){
  Post.findById(req.params.id, function(err, post){
    console.log(post)
    post.description = req.body.description
    post.title = req.body.title
    post.from = req.body.from
    console.log(post)
    post.save(function(err){
      if(err){
        console.log(err)
        res.redirect("back")
      }else {
        res.render("posts/index")
      }
    })
  })
})


// Delete post


router.delete( '/:id', function( req, res ){
  const ObjectId = mongoose.Types.ObjectId;

  let query = {_id:new ObjectId(req.params.id)}
  console.log(query)

  Post.deleteOne(query, function(err) {
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
})


//Removes unsaved post image
function removePostImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err =>  {
    if (err) console.log(err)
  })
}


//Handles the redirects
async function renderNewPage(res, post, hasError = false) {
  try {
    const params = {
      post: post
    }
    if (hasError) params.errorMessage = 'Error Creating Post'
    res.render('posts/new', params)
  } catch {
    res.redirect('/posts')
  }
}
  
module.exports = router;
