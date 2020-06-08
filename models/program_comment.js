const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

 const programCommentSchema = new mongoose.Schema({

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
    program: { type: Schema.Types.ObjectId, ref: 'Program'}
 })



 module.exports = mongoose.model('Programcomment', programCommentSchema)
