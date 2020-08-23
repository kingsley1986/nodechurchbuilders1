const express = require("express");
const router = express.Router();
const Programimage = require("../models/program-image");
const Program = require("../models/program");

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

const uploadPath = path.join("public", Programimage.ProgramImageImageBasePath);
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

// CREATE Comment
router.post(
  "/:programId/programimage",
  upload.single("image"),
  async (req, res, next) => {
    const program = await Program.findOne({ _id: req.params.programId });

    const programImage = new Programimage();
    programImage.title = req.body.title;
    programImage.program = program._id;
    programImage.image = req.file.location;
    if (req.file.location) {
      await programImage.save();

      program.programimages.push(programImage._id);
      await program.save();
      console.log(program);

      res.redirect("back");
    } else {
      res.redirect("back");
    }
  }
);

router.delete("/:programId/:programimageId", async function (req, res) {
  console.log("i have been hitted");
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.programId,
      {
        $pull: { programimages: req.params.programimageId },
      },
      { new: true }
    );

    if (!program) {
      return res.status(400).send("Post not found");
    }

    await Programimage.findByIdAndDelete(req.params.programimageId);

    res.send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
