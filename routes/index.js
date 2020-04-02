var express = require('express');
const mongoose = require('mongoose');

var router = express.Router();

//for uploading image
var multer = require('multer');
var upload = multer({dest: './uploads'});
const fs = require('fs');






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