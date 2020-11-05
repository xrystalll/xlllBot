const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const GamesSchema = new Schema({
  game: {
    type: String,
    required: true,
    unique: true
  },
  short: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
})

module.exports = GamesDB = Mongoose.model('Game', GamesSchema)
