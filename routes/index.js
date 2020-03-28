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
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]


});

const BlogComment = new Schema({
  body  : {type: String, required: true},
  post: [{ type: Schema.Types.ObjectId, ref: 'Post'}],

  date: { type: Date, default: Date.now },
});

var Post = mongoose.model('Post', BlogPost);
var Comment = mongoose.model('Comment', BlogComment);

// Get new post form
router.get('/newpost', function(req, res, next) {
  res.render("newchurchpost");
});

//create a post
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

// CREATE Comment
router.post("/posts/:postId/comment", async(req, res) => {
  const post = await Post.findOne({_id: req.params.postId});

  const comment = new Comment();
  comment.body = req.body.body;
  comment.post = post._id;
  await comment.save();

  post.comments.push(comment._id);
  await post.save();

  res.render('post_show',{
    "post": post
  });
});


// Get Posts
router.get('/posts', function(req, res, next) {
  Post.find()
    .then(function(doc) {
      res.render('postlists', {items: doc});
    });
});


// Get post with comments
router.get("/post/:postId/comments", async (req, res) => {
  const post = await Post.findOne({_id: req.params.postId}).populate(
    "comments"
  );
  res.render('post_show',{
    "post": post
  });
})

// Get a post
// router.get('/post/:id', function(req, res, next) {
//   Post.findById(req.params.id, function(err, post){
//     res.render('post_show',{
//       "post": post
//     });
//   });
// });



// Delete post

// router.get('/post/:id', function(req, res, next) { 

//   Post.find({})
//   .populate('commentsIds')
//   .exec(function(err, posts, count){  
//     res.render( 'post_show', {
//       user: req.user,
//       page : 'post_show',
//       title : '??????',
//       posts : posts
//     });
// });
// });


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
