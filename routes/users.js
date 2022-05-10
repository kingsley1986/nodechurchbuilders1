var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");

// handle file uploads
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const uploadPath = path.join("public", User.userImageBasePath);
const imageMineTypes = ["image/jpeg", "image/png", "image/gif"];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMineTypes.includes(file.mimetype));
  },
});

/* GET users listing. */
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("showusers", {
      users: users,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Register", layout: false });
});
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login", layout: false });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Invalid username or password",
  }),
  function (req, res) {
    req.flash("success", "You are now logged");
    res.redirect("/");
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }
      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      });
    });
  })
);

router.post(
  "/register",
  upload.single("profileimage"),
  function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    if (req.file) {
      console.log("Uploading File....");
      var profileimage = req.file.filename;
    } else {
      console.log("No File Uploaded....");
      var profileimage = "noimage.jpg";
    }

    // Form validator
    req.checkBody("name", "Name field is required").notEmpty();
    req.checkBody("email", "Email field is required").notEmpty();
    req.checkBody("email", "Email field is required").isEmail();
    req.checkBody("username", "Username field is required").notEmpty();
    req.checkBody("password", "password field is required").notEmpty();
    req
      .checkBody("password2", "password do not match")
      .equals(req.body.password);

    const fileName = req.file != null ? req.file.filename : null;

    // check Errors
    var errors = req.validationErrors();

    User.findOne(
      {
        email: req.body.email,
      },
      function (err, user) {
        if (user) {
          req.flash("error", "user already exists", req.body.email);
          res.render("register");
        } else if (errors) {
          res.render("register", {
            errors: errors,
          });
        } else if (password.length < 6) {
          req.flash("error", "password must be at least 6 characters");
          res.render("register");
        } else {
          var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: fileName,
          });
          User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
          });
          req.flash("success", "You are now registered and and login");
          res.redirect("/");
        }
      }
    );
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "You are now Logged out");
  res.redirect("/users/login");
});
module.exports = router;
