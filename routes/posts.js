const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

var AWS = require("aws-sdk");
var multerS3 = require("multer-s3");

AWS.config.update({
  secretAccessKey: process.env.S3_SECRECT,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.S3_REGION,
});
AWS.config.update({
  secretAccessKey: process.env.S3_SECRECT,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const uploadPath = path.join("public", Post.postImageBasePath);
const imageMineTypes = ["image/jpeg", "image/png", "image/gif"];
const bucketname = "nodechurchbuilders";

s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: bucketname,
    s3BucketEndpoint: true,
    endpoint: "http://" + bucketname + ".s3.amazonaws.com",
    key: function (req, file, cb) {
      const uploadPathWithOriginalName = uploadPath + "/" + file.originalname;
      cb(null, uploadPathWithOriginalName);
    },
  }),
});

// Get all Blog posts
router.get("/", async (req, res) => {
  Post.find(function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.json(posts);
    }
  });
});

// New blogpost routes
router.get("/new", async (req, res, next) => {
  renderNewPage(res, new Post());
});

// Create blogpost routes
router.post("/", upload.single("cover"), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null;
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    from: req.body.from,
    postImage: req.file.location,
  });
  try {
    const newPost = await post.save();
    res.redirect("/posts");
  } catch {
    if (post.postImage != null) {
      removePostImage(post.postImage);
    }
    renderNewPage(res, post, true);
  }
});

// Get a post With comments

router.get("/:id/comments", async (req, res) => {
  Post.findById({ _id: req.params.id })
    .populate("comments", "_id name description createdAt", null, {
      sort: { createdAt: -1 },
    })
    .exec(function (error, results) {
      res.json(results);
    });
});

router.get("/edit/:id", async (req, res) => {
  Post.findById(req.params.id, function (err, post) {
    if (!post) {
      return next(new Error("Could not load Document"));
    } else {
      res.render("posts/edit", {
        post: post,
        layout: false,
      });
    }
  });
});

router.post("/edit/:id", upload.single("cover"), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null;
  let post = {};
  post.title = req.body.title;
  post.description = req.body.description;
  post.from = req.body.from;
  post.postImage = fileName;
  let query = { _id: req.params.id };
  Post.updateOne(query, post, (err, post) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/posts");
    }
  });
});

// Delete post

router.delete("/:id", function (req, res) {
  const ObjectId = mongoose.Types.ObjectId;
  let query = { _id: new ObjectId(req.params.id) };
  console.log(query);

  Post.deleteOne(query, function (err) {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

//Removes unsaved post image
function removePostImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.log(err);
  });
}

//Handles the redirects
async function renderNewPage(res, post, hasError = false) {
  try {
    const params = {
      post: post,
      layout: false,
    };
    if (hasError) params.errorMessage = "Error Creating Post";
    res.render("posts/new", params);
  } catch {
    res.redirect("/posts");
  }
}

module.exports = router;
