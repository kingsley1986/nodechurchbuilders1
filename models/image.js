const mongoose = require("mongoose");
const galleryImageBasePath = "uploads/galleryImages";
const path = require("path");
require("dotenv").config();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// postSchema.virtual('coverImagePath').get(function() {
//     if(this.postImage != null) {
//         return path.join('/', postImageBasePath, this.postImage)
//     }
// })

module.exports = mongoose.model("Image", imageSchema);
module.exports.galleryImageBasePath = galleryImageBasePath;
