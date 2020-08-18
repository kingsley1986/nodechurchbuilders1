const express = require("express");
const router = express.Router();
const Event = require("../models/event");
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

router.get("/", async (req, res) => {
  Event.find(function (err, events) {
    if (err) {
      console.log(err);
    } else {
      res.json(events);
    }
  });
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

router.get("/:id/eventcomments", async (req, res) => {
  Event.findById({ _id: req.params.id })
    .populate("eventcomments", "_id name description createdAt", null, {
      sort: { createdAt: -1 },
    })
    .exec(function (error, results) {
      res.json(results);
    });
});

router.get("/lives", async (req, res) => {
  try {
    const lives = await Event.find(
      { startingDate: { $lt: new Date() } } && {
        closingDate: { $gt: new Date() },
      }
    );
    res.render("events/live", {
      lives: lives,
      layout: false,
    });
  } catch {
    res.redirect("/events");
  }
});

router.get("/upcomingevents", async (req, res) => {
  try {
    const upcomingevents = await Event.find({
      startingDate: { $gt: new Date() },
    });
    res.render("events/upcomings", {
      upcomingevents: upcomingevents,
      layout: false,
    });
  } catch {
    res.redirect("/events");
  }
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
router.post("/create", upload.single("eventImage"), async (req, res, next) => {
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
router.delete("/:id/delete", function (req, res) {
  const ObjectId = mongoose.Types.ObjectId;

  let query = { _id: new ObjectId(req.params.id) };

  Event.deleteOne(query, function (event, err) {
    if (err) {
      console.log(err);
    }
    res.json(event);
  });
});

router.get("/edit/:id", async (req, res) => {
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

router.post(
  "/edit/:id",
  upload.single("eventImage"),
  async (req, res, next) => {
    const fileName = req.file != null ? req.file.filename : null;
    console.log(req.body);
    let event = {};
    event.title = req.body.title;
    event.description = req.body.description;
    event.eventImage = fileName;
    event.startingDate = req.body.startingDate;
    event.closingDate = req.body.closingDate;
    let query = { _id: req.params.id };
    Event.updateOne(query, event, (err, event) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.redirect("/events");
      }
    });
  }
);

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
      console.log(event);
      if (error) {
        console.log(error);
      } else {
        res.json(event);
      }
    }
  );
});

module.exports = router;
