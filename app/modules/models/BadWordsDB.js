const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const BadWordsSchema = new Schema({
  word: {
    type: String,
    required: true,
    lowercase: true
  },
  duration: {
    type: Number,
    required: true
  },
  channel: {
    type: String,
    required: true,
    lowercase: true
  }
})

module.exports = BadWordsDB = Mongoose.model('Badword', BadWordsSchema)
