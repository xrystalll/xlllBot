const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const findOrCreate = require('mongoose-findorcreate')

const InviteSchema = new Schema({
  channel: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
})
InviteSchema.plugin(findOrCreate)

module.exports = InviteDB = Mongoose.model('Invite', InviteSchema)
