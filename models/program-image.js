const mongoose = require("mongoose");
const path = require("path");
const ProgramImageImageBasePath = "uploads/programImages";
require("dotenv").config();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const programImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  image: {
    type: String,
    require: true,
  },
  program: { type: Schema.Types.ObjectId, ref: "Program" },
});
module.exports = mongoose.model("Programimage", programImageSchema);
module.exports.ProgramImageImageBasePath = ProgramImageImageBasePath;
