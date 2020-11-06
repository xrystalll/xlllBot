const path = require('path')
const config = require(path.join(__dirname, '..', '..', 'config', 'default.json'))
const { timeFormat } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))
const UserDB = require(path.join(__dirname, '..', 'models', 'UserDB'))
const request = require('request')

const old = (channel, state, args, checkBroadcasterPermission) => {
  const userId = state.user['user-id']
  const roomId = state.user['room-id']
  const userName = state.user.username
  const targetUser = args[0] ? args[0].replace('@', '') : null

  if (!targetUser) {
    if (checkBroadcasterPermission()) {
      client.say(channel, `@${userName} ты хочешь узнать подписан ли ты сам на себя? FailFish`)
      return
    }

    UserDB.findOne({ login: channel })
      .then(data => {
        request({
          method: 'GET',
          url: `https://api.twitch.tv/helix/users/follows?from_id=${userId}&to_id=${roomId}`,
          headers: {
            Authorization: 'Bearer ' + data.token,
            'Client-ID': config.bot.client_id
          }
        }, (err, res, body) => {
          if (err) return

          const userObj = JSON.parse(body)
          const user = userObj.data

          if (user.length) {
            client.say(channel, `@${userName} подписан на канал ${channel} ${timeFormat(user[0].followed_at)} B)`)
          } else {
            client.say(channel, `@${userName} ты не подписан NotLikeThis`)
          }
        })
      })
  } else {
    if (targetUser === userName) {
      client.say(channel, `@${userName} подписан ли ${targetUser} сам на себя? CoolStoryBob`)
      return
    }

    UserDB.findOne({ login: channel })
      .then(data => {
        request({
          method: 'GET',
          url: `https://api.twitch.tv/helix/users?login=${targetUser}`,
          headers: {
            Authorization: 'Bearer ' + data.token,
            'Client-ID': config.bot.client_id
          }
        }, (err, res, body) => {
          if (err) return

          const userObj = JSON.parse(body)
          const user = userObj.data

          if (user.length) {
            request({
              method: 'GET',
              url: `https://api.twitch.tv/helix/users/follows?from_id=${user[0].id}&to_id=${roomId}`,
              headers: {
                Authorization: 'Bearer ' + data.token,
                'Client-ID': config.bot.client_id
              }
            }, (err, res, body) => {
              if (err) return

              const userObj = JSON.parse(body)
              const user = userObj.data

              if (user.length) {
                client.say(channel, `@${userName}, ${targetUser} подписан на канал ${channel} ${timeFormat(user[0].followed_at)} B)`)
              } else {
                client.say(channel, `@${userName}, ${targetUser} не подписан NotLikeThis`)
              }
            })
          }
        })
      })
  }
}

module.exports = { old }
