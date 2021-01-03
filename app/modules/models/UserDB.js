const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const findOrCreate = require('mongoose-findorcreate')

const UserSchema = new Schema({
  twitchId: {
    type: String,
    required: true,
    unique: true
  },
  login: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  token: {
    type: String
  },
  hash: {
    type: String
  },
  logo: {
    type: String
  },
  admin: {
    type: Boolean
  }
})
UserSchema.plugin(findOrCreate)

module.exports = UserDB = Mongoose.model('User', UserSchema)
