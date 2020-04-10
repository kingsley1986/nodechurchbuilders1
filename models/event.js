const mongoose = require('mongoose')
const eventImageBasePath = 'uploads/eventImages'
const path = require('path')
require('dotenv').config()
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


 const eventSchema = new mongoose.Schema({
    startingDate: {
         type: Date,
         required: true
    },
    closingDate: {
        type: Date,
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
    eventImage: {
        type: String,
        require: true
    }, 
    going: {
        type: Number, default: 0,
    },
    coming_with: {
        type: Number, default: 0,
    },
    eventcomments: [{ type: Schema.Types.ObjectId, ref: 'Eventcomment' }]

 });


eventSchema.virtual('eventImagePath').get(function() {
    if(this.eventImage != null) {
        return path.join('/', eventImageBasePath, this.eventImage)
    }
})

 module.exports = mongoose.model('Event', eventSchema)
 module.exports.eventImageBasePath = eventImageBasePath