const mongoose = require('mongoose')
const programImageBasePath = 'uploads/programImages'
const path = require('path')
require('dotenv').config()
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


 const programSchema = new mongoose.Schema({
    programtype: {
         type: String,
         required: true
    },
    title: {
        type: String,
        required: true
   },
    description: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now
    },
    programImage: {
        type: String,
        require: true
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
 })


programSchema.virtual('programImagePath').get(function() {
    if(this.programImage != null) {
        return path.join('/', programImageBasePath, this.programImage)
    }
})

 module.exports = mongoose.model('Program', programSchema)
 module.exports.programImageBasePath = programImageBasePath