const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

var AWS = require("aws-sdk");
var multerS3 = require("multer-s3");
const { exec } = require("child_process");

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

const uploadPath = path.join("public", Event.eventImageBasePath);
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

router.get("/api", async (req, res) => {
  Event.find(function (err, events) {
    if (err) {
      console.log(err);
    } else {
      res.json(events);
    }
  });
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find({});
    console.log(events);
    res.render("events/index", {
      events: events,
      layout: false,
    });
  } catch {
    res.redirect("/events");
  }
});

// // Get a single comment
// router.get("/:id/show", async (req, res) => {
//   const event = await Event.findOne({_id: req.params.id})
//   res.render('events/show',{
//     "event": event
//   });
// })

// Get a Event Wiht comments
// router.get("/:id/eventcomments", async (req, res) => {
//   const event = await Event.findById({ _id: req.params.id }).populate(
//     "eventcomments"
//   );
//   res.json(event);
// });

router.get("/:id/eventcomments/api", async (req, res) => {
  Event.findById({ _id: req.params.id })
    .populate("eventcomments", "_id name description createdAt", null, {
      sort: { createdAt: -1 },
    })
    .exec(function (error, results) {
      res.json(results);
    });
});

router.get("/:id/eventcomments/", async (req, res) => {
  const event = await Event.findById({ _id: req.params.id }).populate(
    "eventcomments",
    "_id name description createdAt",
    null,
    {
      sort: { createdAt: -1 },
    }
  );
  res.render("events/show", {
    event: event,
    layout: false,
  });
});

router.get("/lives", async (req, res) => {
  Event.find()
    .and([
      { $or: [{ startingDate: { $lt: new Date() } }] },
      { $or: [{ closingDate: { $gt: new Date() } }] },
    ])
    .exec(function (err, results) {
      res.json(results);
    });
});

router.get("/upcomingevents", async (req, res) => {
  const upcomingevents = await Event.find({
    startingDate: { $gt: new Date() },
  });
  res.json(upcomingevents);
});

router.get("/pastevents", async (req, res) => {
  try {
    const pastevents = await Event.find({ closingDate: { $lt: new Date() } });
    res.render("events/pastevents", {
      pastevents: pastevents,
      layout: false,
    });
  } catch {
    res.redirect("/events");
  }
});

// New events routes
router.get("/new", async (req, res, next) => {
  renderNewPage(res, new Event());
});

// Create Events routes
router.post("/create", upload.single("cover"), async (req, res, next) => {
  console.log(req.file);
  const fileName = req.file != null ? req.file.filename : null;

  const event = new Event({
    startingDate: req.body.startingDate,
    closingDate: req.body.closingDate,
    title: req.body.title,
    description: req.body.description,
    eventImage: req.file.location,
  });
  try {
    const events = await event.save();
    res.redirect("/events");
  } catch {
    if (event.eventImage != null) {
      removeeventImage(event.eventImage);
    }
    res.redirect("back");
  }
});

//Deleting an event
// router.delete("/:id/delete", function (req, res) {
//   const ObjectId = mongoose.Types.ObjectId;

//   let query = { _id: new ObjectId(req.params.id) };

//   Event.deleteOne(query, function (event, err) {
//     if (err) {
//       console.log(err);
//     }
//     res.json(event);
//   });
// });

router.delete("/:id", async (req, res) => {
  console.log("I am deleting now");

  Event.findById(req.params.id, function (err, event) {
    var splittedKey = event.eventImage.replace(process.env.SPLITTED, "");
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
    s3.deleteObject(params, (error, data) => {
      if (error) {
        res.status(500).send(error);
      } else {
        const ObjectId = mongoose.Types.ObjectId;

        let query = { _id: new ObjectId(req.params.id) };

        event.deleteOne(query, function (err) {
          if (err) {
            console.log(err);
          }
          res.send("Success");
        });
        console.log("File has been deleted successfully");
      }
      // res.s
    });
  });
});

router.get("/:id/edit", async (req, res) => {
  Event.findById(req.params.id, function (err, event) {
    if (!event) {
      return next(new Error("Could not load Document"));
    } else {
      res.render("events/edit", {
        event: event,
        layout: false,
      });
    }
  });
});

// router.post(
//   "/edit/:id",
//   upload.single("eventImage"),
//   async (req, res, next) => {
//     const fileName = req.file != null ? req.file.filename : null;
//     console.log(req.body);
//     let event = {};
//     event.title = req.body.title;
//     event.description = req.body.description;
//     event.eventImage = fileName;
//     event.startingDate = req.body.startingDate;
//     event.closingDate = req.body.closingDate;
//     let query = { _id: req.params.id };
//     Event.updateOne(query, event, (err, event) => {
//       if (err) {
//         console.log(err);
//         res.redirect("back");
//       } else {
//         res.redirect("/events");
//       }
//     });
//   }
// );

// router.post("/:id/update", upload.single("cover"), async (req, res, next) => {
//   console.log(req.file);

//   Event.findById(req.params.id, function (err, event) {
//     var splittedKey = event.eventImage
//       ? event.eventImage.replace(process.env.SPLITTED, "")
//       : "";
//     const awsCredentials = {
//       secretAccessKey: process.env.S3_SECRECT,
//       accessKeyId: process.env.AWS_ACCESS_KEY,
//       region: process.env.S3_REGION,
//     };
//     var s3 = new AWS.S3(awsCredentials);
//     const params = {
//       Bucket: process.env.S3_BUCKET,
//       Key: splittedKey,
//     };
//     s3.deleteObject(params, (error, data) => {
//       let event2 = {};
//       event2.title = req.body.title;
//       event2.description = req.body.description;
//       event2.startingDate = req.body.startingDate;
//       event2.closingDate = req.body.closingDate;
//       event2.eventImage = req.file.location;
//       let query = { _id: req.params.id };
//       Event.updateOne(query, event2, (err, event) => {
//         if (err) {
//           console.log(err);
//           res.redirect("back");
//         } else {
//           res.redirect("/events");
//         }
//       });

//       // res.s
//     });
//   });
// });

router.post("/:id/update", upload.single("cover"), async (req, res, next) => {
  // console.log(req.file);

  Event.findById(req.params.id, function (err, event) {
    if (req.file !== undefined) {
      var splittedKey = event.eventImage.replace(process.env.SPLITTED, "");
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
      s3.deleteObject(params, (error, data) => {});
    }
    let event2 = {};
    event2.title = req.body.title;
    event2.description = req.body.description;
    if (req.body.startingDate) {
      event2.startingDate = req.body.startingDate;
    }
    if (req.body.closingDate) {
      event2.closingDate = req.body.closingDate;
    }
    if (req.file) {
      event2.eventImage = req.file.location;
    }
    let query = { _id: req.params.id };
    Event.updateOne(query, event2, (err, event) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.redirect("/programs");
      }
    });

    // res.s
  });
});

//Removes unsaved post image
function removeeventImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.log(err);
  });
}

async function renderNewPage(res, event, hasError = false) {
  try {
    const params = {
      event: event,
      layout: false,
    };
    if (hasError) params.errorMessage = "Error Creating event";
    res.render("events/new", params);
  } catch {
    res.redirect("/events");
  }
}

router.get("/:id/going", async (req, res, next) => {
  Event.findById(req.params.id, function (err, event) {
    if (!event) {
      return next(new Error("Could not load Document"));
    } else {
      event.going += 1;
      event.save();
      res.json(event);
    }
  });
});

router.post("/:id/coming_with", async (req, res, next) => {
  console.log("I am coming with someone");
  Event.findByIdAndUpdate(
    { _id: req.params.id },
    { $inc: { coming_with: req.body.coming_with } },
    function (error, event) {
      if (error) {
        console.log(error);
      } else {
        res.json(event);
      }
    }
  );
});

module.exports = router;
