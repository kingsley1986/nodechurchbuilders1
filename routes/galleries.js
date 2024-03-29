const express = require("express");
const router = express.Router();
const Gallery = require("../models/gallery");
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

const uploadPath = path.join("public", Gallery.galleryImageBasePath);
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

// New Gallery routes
router.get("/new", async (req, res, next) => {
  renderNewPage(res, new Gallery());
});

// Get all Image Galleries API'S
router.get("/api", async (req, res) => {
  Gallery.find(function (err, galleries) {
    if (err) {
      console.log(err);
    } else {
      res.json(galleries);
    }
  });
});

// Get all Image Galleries
router.get("/", async (req, res) => {
  Gallery.find(function (err, galleries) {
    if (err) {
      console.log(err);
    } else {
      res.render("galleries/index", {
        galleries: galleries,
        layout: false,
      });
    }
  });
});

router.get("/:id", async (req, res) => {
  Gallery.findById({ _id: req.params.id, sort: { createdAt: -1 } }).exec(
    function (error, results) {
      console.log(results);
      res.render("galleries/show", {
        gallery: results,
        layout: false,
      });
    }
  );
});

// Create Gallery routes
// router.post("/", upload.single("file"), async (req, res, next) => {
//   const fileName = req.file != null ? req.file.filename : null;
//   const gallery = new Gallery({
//     title: req.body.title,
//     galleryImage: req.file.location,
//   });
//   try {
//     const newGallery = await gallery.save();
//     res.redirect("/galleries");
//   } catch {
//     if (gallery.galleryImage != null) {
//       removeGalleryImage(gallery.galleryImage);
//     }
//     renderNewPage(res, gallery, true);
//   }
// });

router.post("/create", upload.single("cover"), async (req, res, next) => {
  const gallery = new Gallery({
    title: req.body.title,
    galleryImage: req.file.location,
  });

  try {
    const programs = await gallery.save();
    res.redirect("/galleries");
  } catch (error) {
    res.render("programs/new");
    console.log(error);
  }
});

router.get("/edit/:id", async (req, res) => {
  Gallery.findById(req.params.id, function (err, gallery) {
    if (!gallery) {
      return next(new Error("Could not load Document"));
    } else {
      res.render("galleries/edit", {
        gallery: gallery,
        layout: false,
      });
    }
  });
});

router.post("/edit/:id", upload.single("cover"), async (req, res, next) => {
  Gallery.findById(req.params.id, function (err, gallery) {
    var splittedKey = gallery.galleryImage.replace(process.env.SPLITTED, "");

    const awsCredentials = {
      secretAccessKey: process.env.S3_SECRECT,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      region: process.env.S3_REGION,
    };
    var s3 = new AWS.S3(awsCredentials);
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: splittedKey,
    };

    if (req.file) {
      s3.deleteObject(params, (error, data) => {
        if (error) {
          res.status(500).send(error);
        } else {
          let gallery2 = {};
          gallery2.title = req.body.title;
          gallery2.galleryImage = req.file.location;
          let query = { _id: req.params.id };
          Gallery.updateOne(query, gallery2, (err, gallery) => {
            if (err) {
              console.log(err);
              res.redirect("back");
            } else {
              res.redirect("/galleries");
            }
          });
        }
      });
    } else if (!req.file) {
      gallery2 = {};
      gallery2.title = req.body.title;
      // program2.programImage = req.file.location;
      let query = { _id: req.params.id };
      Gallery.updateOne(query, gallery2, (err, gallery) => {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          res.redirect("/galleries");
        }
      });
    }

    // res.s
  });
});

// router.post("/edit/:id", upload.single("cover"), async (req, res, next) => {
//   const fileName = req.file != null ? req.file.filename : null;
//   let gallery = {};
//   gallery.title = req.body.title;
//   gallery.galleryImage = req.file.location;

//   let query = { _id: req.params.id };
//   Gallery.updateOne(query, gallery, (err, gallery) => {
//     if (err) {
//       console.log(err);
//       res.redirect("back");
//     } else {
//       res.redirect("/galleries");
//     }
//   });
// });

// Delete post
router.delete("/:id", function (req, res) {
  const ObjectId = mongoose.Types.ObjectId;
  let query = { _id: new ObjectId(req.params.id) };
  console.log(query);

  Gallery.deleteOne(query, function (err) {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

//Removes unsaved post image
function removeGalleryImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.log(err);
  });
}

//Handles the redirects
async function renderNewPage(res, gallery, hasError = false) {
  try {
    const params = {
      gallery: gallery,
      layout: false,
    };
    if (hasError) params.errorMessage = "Error Creating Gallery";
    res.render("galleries/new", params);
  } catch {
    res.redirect("/galleries");
  }
}

module.exports = router;
