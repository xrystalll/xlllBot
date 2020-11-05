const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const EventsSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true,
    lowercase: true
  }
})

module.exports = EventsDB = Mongoose.model('Event', EventsSchema)
