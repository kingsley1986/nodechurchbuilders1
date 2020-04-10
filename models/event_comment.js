const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

 const eventcommentSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now
    },
    event: { type: Schema.Types.ObjectId, ref: 'Event'}
 })



 module.exports = mongoose.model('Eventcomment', eventcommentSchema)
