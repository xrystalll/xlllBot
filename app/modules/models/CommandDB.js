const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const CommandSchema = new Schema({
  tag: {
    type: String,
    required: true,
    lowercase: true
  },
  text: {
    type: String,
    required: true
  },
  countdown: {
    type: Number,
    required: true
  },
  last_auto_send: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true,
    lowercase: true
  }
})

module.exports = CommandDB = Mongoose.model('Command', CommandSchema)
