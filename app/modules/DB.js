const path = require('path')
const config = require(path.join(__dirname, '..', 'config', 'default.json'))

const Mongoose = require('mongoose')
const cachegoose = require('cachegoose')

const ChannelsDB = require(path.join(__dirname, 'models', 'ChannelsDB'))
 
cachegoose(Mongoose)

Mongoose.connect(config.mongoremote, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    ChannelsDB.updateMany({ bot_active: true }, { bot_active: false }, (err) => {
      if (err) console.error('Change bot status error:', err)
    })
    console.log('MongoDB connected.')
  })
  .catch(err => console.error('MongoDB error: ', err))
