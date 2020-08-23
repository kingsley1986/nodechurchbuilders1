const express = require("express");
const router = express.Router();
const Program = require("../models/program");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

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

const uploadPath = path.join("public", Program.programImageBasePath);
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

router.get("/", async (req, res) => {
  Program.find(function (err, programs) {
    if (err) {
      console.log(err);
    } else {
      res.json(programs);
    }
  });
});

router.get("/:id/programcomments", async (req, res) => {
  const program = await Program.findOne({ _id: req.params.id })
    .populate("programcomments")
    .populate("programimages")
    .exec(function (err, program) {
      res.json(program);
    });
});

// New Program routes
router.get("/new", async (req, res, next) => {
  renderNewPage(res, new Program());
});

// Create blogpost routes
router.post("/create", upload.single("cover"), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null;
  const program = new Program({
    programtype: req.body.programtype,
    title: req.body.title,
    description: req.body.description,
    programImage: req.file.location,
  });
  try {
    console.log(program);
    const programs = await program.save();
    res.redirect("/programs");
  } catch {
    if (program.programImage != null) {
      removeprogramImage(program.programImage);
    }
    res.render("programs/new");
  }
});

router.get("/:id/:edit", async (req, res, next) => {
  Program.findById(req.params.id, function (err, program) {
    if (!program) {
      return next(new Error("Could not load Document"));
    } else {
      res.render("programs/edit", {
        program: program,
      });
    }
  });
});

router.post("/edit/:id", upload.single("cover"), async (req, res, next) => {
  const fileName = req.file != null ? req.file.filename : null;
  console.log(req.body);
  let program = {};
  program.programtype = req.body.programtype;
  program.title = req.body.title;
  program.description = req.body.description;
  program.programImage = fileName;
  let query = { _id: req.params.id };
  Program.updateOne(query, program, (err, program) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/programs");
    }
  });
});

router.delete("/:id", function (req, res) {
  const ObjectId = mongoose.Types.ObjectId;

  let query = { _id: new ObjectId(req.params.id) };

  Program.deleteOne(query, function (err) {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

//Removes unsaved post image
function removeprogramImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.log(err);
  });
}

//Handles the redirects
async function renderNewPage(res, program, hasError = false) {
  try {
    const params = {
      program: program,
      layout: false,
    };
    if (hasError) params.errorMessage = "Error Creating program";
    res.render("programs/new", params);
  } catch {
    res.redirect("/programs");
  }
}

module.exports = router;
