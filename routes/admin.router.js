const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");
const mongoose = require("mongoose");
const Program = require("../models/program");
const program = require("../routes/programs");
AdminBro.registerAdapter(AdminBroMongoose);
const uploadFeature = require("@admin-bro/upload");

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

var region = process.env.S3_REGION;
var bucket = process.env.S3_BUCKET;
var secretAccessKey = process.env.AWS_ACCESS_KEY;

const uploadPath = path.join("public", Program.programImageBasePath);
const imageMineTypes = ["image/jpeg", "image/png", "image/gif"];

s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: process.env.S3_BUCKET,
    s3BucketEndpoint: true,
    endpoint: "http://" + process.env.S3_BUCKET + ".s3.amazonaws.com",
    key: function (req, file, cb) {
      const uploadPathWithOriginalName = uploadPath + "/" + file.originalname;
      cb(null, uploadPathWithOriginalName);
    },
  }),
});

// console.log(upload);

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
  resources: [
    {
      resource: Program,
      // options: {
      //   listProperties: ["", imageMineTypes],
      // },
      features: [
        uploadFeature({
          provider: { aws: { region, bucket, secretAccessKey } },
          properties: {
            key: function (req, file, cb) {
              const uploadPathWithOriginalName =
                uploadPath + "/" + file.originalname;
              cb(null, uploadPathWithOriginalName);
            }, // to this db field feature will safe S3 key
            mimeType: imageMineTypes, // this property is important because allows to have previews
          },
          // validation: {
          //   mimeTypes: "application/pdf",
          // },
        }),
      ],
    },
  ],
});

const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;
