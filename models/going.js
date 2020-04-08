const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


 const goingSchema = new mongoose.Schema({
    yes: {
         type: Number,
         required: true
    },
    event: { type: Schema.Types.ObjectId, ref: 'Event'}
 });


 module.exports = mongoose.model('Going', goingSchema)