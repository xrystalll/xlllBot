const path = require('path')
const client = require(path.join(__dirname, 'client'))

const CommandDB = require(path.join(__dirname, 'models', 'CommandDB'))

const { upTime } = require(path.join(__dirname, 'commands', 'upTime'))
const { old } = require(path.join(__dirname, 'commands', 'old'))
const { pingPong, cockSize } = require(path.join(__dirname, 'commands', 'miniGames'))
const { addVideo, skipVideo } = require(path.join(__dirname, 'commands', 'video'))
const { timeOutUser, banUser, unbanUser } = require(path.join(__dirname, 'commands', 'blocking'))
const { game } = require(path.join(__dirname, 'commands', 'game'))
const { title } = require(path.join(__dirname, 'commands', 'title'))
const { poll } = require(path.join(__dirname, 'commands', 'poll'))

let state = null

const CallCommand = (command, messageObj, io) => {
  state = messageObj
  const channel = state.channel

  CommandDB.find({ tag: command.command, channel })
    .then(data => {
      if (!data.length) return

      client.say(channel, data[0].text)
    })
    .catch(err => console.error(err))

  switch (command.command) {
    case 'time':
    case 'uptime':
    case 'up':
      upTime(channel, state.user['room-id'])
      break
    case 'old':
    case 'oldfag':
    case 'followage':
      old(channel, state, command.args, checkBroadcasterPermission)
      break
    case 'ping':
      pingPong(channel, state.user.username)
      break
    case 'size':
      cockSize(channel, state.user.username, command.args)
      break
    case 'sr':
      addVideo(channel, state, command.args, io)
      break
    case 'skip':
      if (!checkModeratorPermission()) return
      skipVideo(channel, io)
      break
    case 'mute':
    case 'timeout':
      if (!checkModeratorPermission()) return
      timeOutUser(channel, command.args)
      break
    case 'ban':
    case 'permit':
      if (!checkModeratorPermission()) return
      banUser(channel, command.args)
      break
    case 'unban':
      if (!checkModeratorPermission()) return
      unbanUser(channel, command.args)
      break
    case 'game':
      if (!checkModeratorPermission()) return
      game(channel, state.user['room-id'], command.args)
      break
    case 'title':
      if (!checkModeratorPermission()) return
      title(channel, state.user['room-id'], command.args)
      break
    case 'poll':
    case 'vote':
      if (!checkModeratorPermission()) return
      poll(channel, command.args)
      break
    default:
      break
  }
}

const checkBroadcasterPermission = () => state.user.username === state.channel
const checkModeratorPermission = () => state.user.mod || state.user.username === state.channel

module.exports = {
  call: (command, messageObj, io) => {
    CallCommand(command, messageObj, io)
  }
}
