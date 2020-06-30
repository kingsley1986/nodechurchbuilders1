const mongoose = require('mongoose')
const galleryImageBasePath = 'uploads/galleryImages'
const path = require('path')
require('dotenv').config()
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


 const gallerySchema = new mongoose.Schema({
    title: {
         type: String,
         required: true
    },
    galleryImage: {
        type: String,
        required: true
   },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now
    }
 })

// postSchema.virtual('coverImagePath').get(function() {
//     if(this.postImage != null) {
//         return path.join('/', postImageBasePath, this.postImage)
//     }
// })

 module.exports = mongoose.model('Gallery', gallerySchema)
 module.exports.galleryImageBasePath = galleryImageBasePath