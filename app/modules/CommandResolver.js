const path = require('path')
const Commands = require(path.join(__dirname, 'Commands'))
const { parseCommand } = require(path.join(__dirname, 'Utils'))

const CommandResolver = (channel, user, message, io) => {
  const command = parseCommand(message)

  if (!command) return

  Commands.call(command, { channel, user, message }, io)
}

module.exports = {
  resolve: (channel, user, message, io) => {
    CommandResolver(channel, user, message, io)
  }
}
