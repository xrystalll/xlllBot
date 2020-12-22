const path = require('path')
const Strings = require(path.join(__dirname, '..', '..', 'config', 'strings.json'))
const { checkSettings, declOfNum } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))

const pingPong = (channel, userName) => {
  checkSettings(channel, 'pingpong').then(bool => {
    if (bool) client.say(channel, `@${userName} pong`)
  })
}

const cockSize = (channel, userName, args) => {
  checkSettings(channel, 'cocksize').then(bool => {
    if (bool) {
      const targetUser = args[0] ? args[0].replace('@', '') : null
      const size = Math.floor(Math.random() * (26 - 8)) + 8
      const sizeStr = declOfNum(size, [Strings.centimeter, Strings.centimeters, Strings.manyCentimeters])

      if (!targetUser) {
        if (size > 15) {
          client.say(channel, `@${userName} ${Strings.wow} ${size} ${sizeStr} ${Strings.pogChamp}`)
        } else {
          client.say(channel, `@${userName} ${Strings.youHave} ${size} ${sizeStr}. ${Strings.dontWorry} ${Strings.lul}`)
        }
      } else {
        if (targetUser === channel) return

        if (size > 15) {
          client.say(channel, `${targetUser} ${Strings.has} ${size} ${sizeStr} ${Strings.pogChamp}`)
        } else {
          client.say(channel, `${targetUser} ${Strings.has} ${size} ${sizeStr} ${Strings.lul}`)
        }
      }
    }
  })
}

module.exports = { pingPong, cockSize }
