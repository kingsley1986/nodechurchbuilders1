var express = require('express');
const mongoose = require('mongoose');

var router = express.Router();

mongoose.connect("mongodb://localhost:27017/churchbuilder1db", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
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
    res.redirect('/getposts');
  })
  .catch(err => {
    res.status(400).send("unable to save to database");
  });

});


// Get a Post
router.get('/getposts', function(req, res, next) {
  Post.find()
    .then(function(doc) {
      res.render('postlists', {items: doc});
    });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
