var express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/post')
const Program = require('../models/program')
const Event = require('../models/event')
var router = express.Router();

//for uploading image
var multer = require('multer');
var upload = multer({dest: './uploads'});
const fs = require('fs');



router.get('/', function(req, res, next) {
  Promise.all([
    Post.find(),
    Program.find(),
    Event.find( { startingDate: { $gt: new Date()} })
  ]).then(([posts, programs, upcomingevents]) =>
    res.render('index', {
      posts,
      programs,
      upcomingevents
    }))
    .catch(err => console.log(err))
})



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