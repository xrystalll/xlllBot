const path = require('path')
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

      if (!targetUser) {
        if (size > 15) {
          client.say(channel, `@${userName} Вау! ${size} ${declOfNum(size, ['синтиметр', 'сантиметра', 'сантиметров'])} PogChamp`)
        } else {
          client.say(channel, `@${userName} у тебя ${size} ${declOfNum(size, ['синтиметр', 'сантиметра', 'сантиметров'])}. Не расстраивайся LUL`)
        }
      } else {
        if (targetUser === channel) return

        if (size > 15) {
          client.say(channel, `У ${targetUser} ${size} ${declOfNum(size, ['синтиметр', 'сантиметра', 'сантиметров'])} PogChamp`)
        } else {
          client.say(channel, `У ${targetUser} ${size} ${declOfNum(size, ['синтиметр', 'сантиметра', 'сантиметров'])} LUL`)
        }
      }
    }
  })
}

module.exports = { pingPong, cockSize }
