const path = require('path')
const config = require(path.join(__dirname, '..', 'config', 'default.json'))
const tmi = require('tmi.js')

const client = new tmi.client({
  options: {
    debug: config.options.debug
  },
  connection: {
    secure: config.connection.secure,
    reconnect: config.connection.reconnect
  },
  identity: {
    username: config.bot.username,
    password: config.bot.oauth_token
  },
  channels: []
})

module.exports = client
