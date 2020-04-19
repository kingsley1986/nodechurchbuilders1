var express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/post')

var router = express.Router();

//for uploading image
var multer = require('multer');
var upload = multer({dest: './uploads'});
const fs = require('fs');



router.get('/', function(req, res, next) {
  Post.find()
  .then(posts => {
      res.render('index', {posts});
  })
  .catch(err => {
      console.log(err);
  })
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members' });
});

function ensureAunthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}
module.exports = router;