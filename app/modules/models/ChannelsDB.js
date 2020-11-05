const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const ChannelsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  bot_active: {
    type: Boolean
  }
})

module.exports = ChannelsDB = Mongoose.model('Channel', ChannelsSchema)
