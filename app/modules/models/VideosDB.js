const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const VideosSchema = new Schema({
  from: {
    username: {
      type: String,
      required: true,
      lowercase: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  yid: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  thumb: {
    type: String,
    required: true
  }
})

module.exports = VideosDB = Mongoose.model('Video', VideosSchema)
