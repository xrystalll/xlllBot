const path = require('path')
const { twitchApi, timeFormat } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))

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

    twitchApi(channel, 'GET', '/users/follows', { urlParams: { from_id: userId, to_id: roomId } }).then(data => {
      if (!data) return

      const twitchData = data.data

      if (twitchData.length) {
        client.say(channel, `@${userName} подписан на канал ${channel} ${timeFormat(twitchData[0].followed_at)} B)`)
      } else {
        client.say(channel, `@${userName} ты не подписан NotLikeThis`)
      }
    })
    .catch(err => console.error(err))

  } else {

    if (targetUser === userName) {
      client.say(channel, `@${userName} подписан ли ${targetUser} сам на себя? CoolStoryBob`)
      return
    }

    twitchApi(channel, 'GET', '/users', { urlParams: { login: targetUser } }).then(data => {
      if (!data) return

      const user = data.data

      if (user.length) {
        twitchApi(channel, 'GET', '/users/follows', { urlParams: { from_id: user[0].id, to_id: roomId } }).then(data => {
          if (!data) return

          const twitchData = data.data

          if (twitchData.length) {
            client.say(channel, `@${userName}, ${targetUser} подписан на канал ${channel} ${timeFormat(twitchData[0].followed_at)} B)`)
          } else {
            client.say(channel, `@${userName}, ${targetUser} не подписан NotLikeThis`)
          }
        })
        .catch(err => console.error(err))
      }
    })
    .catch(err => console.error(err))

  }
}

module.exports = { old }
