var express = require('express');
const mongoose = require('mongoose');

var router = express.Router();

// sudo rm /usr/bin/dpkg 
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const BlogPost = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: { type: Date, default: Date.now },
});

var Post = mongoose.model('Post', BlogPost);

// Get new post form
router.get('/newpost', function(req, res, next) {
  res.render("newchurchpost");
});


router.post("/makepost", (req, res) => {

  var myData = new Post(req.body);
  myData.save()
  .then(item => {
    res.redirect('/posts');
  })
  .catch(err => {
    res.status(400).send("unable to save to database");
  });

});


// Get a Post
router.get('/posts', function(req, res, next) {
  Post.find()
    .then(function(doc) {
      res.render('postlists', {items: doc});
    });
});

// Delete post


router.delete( '/post/:id', function( req, res ){
  const ObjectId = mongoose.Types.ObjectId;

  let query = {_id:new ObjectId(req.params.id)}

  Post.deleteOne(query, function(err) {
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
})





/* GET home page. */
router.get('/', ensureAunthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

function ensureAunthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}
module.exports = router;
