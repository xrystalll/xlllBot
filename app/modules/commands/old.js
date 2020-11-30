const path = require('path')
const Strings = require(path.join(__dirname, '..', '..', 'config', 'strings.json'))
const { twitchApi, timeFormat } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))

const old = (channel, state, args, checkBroadcasterPermission) => {
  const userId = state.user['user-id']
  const roomId = state.user['room-id']
  const userName = state.user.username
  const targetUser = args[0] ? args[0].replace('@', '') : null

  if (!targetUser) {

    if (checkBroadcasterPermission()) {
      client.say(channel, `@${userName} ${Strings.doYouWantKnowYouAreSubscribedToYourself} ${Strings.failFish}`)
      return
    }

    twitchApi(channel, 'GET', '/users/follows', { urlParams: { from_id: userId, to_id: roomId } }).then(data => {
      if (!data) return

      const twitchData = data.data

      if (twitchData.length) {
        client.say(channel, `@${userName} ${Strings.subscribedToChannel} ${channel} ${timeFormat(twitchData[0].followed_at)} ${Strings.b}`)
      } else {
        client.say(channel, `@${userName} ${Strings.youAreNotSubscribed} ${Strings.notLikeThis}`)
      }
    })
    .catch(err => console.error(err))

  } else {

    twitchApi(channel, 'GET', '/users', { urlParams: { login: targetUser } }).then(data => {
      if (!data) return

      const user = data.data

      if (user.length) {
        twitchApi(channel, 'GET', '/users/follows', { urlParams: { from_id: user[0].id, to_id: roomId } }).then(data => {
          if (!data) return

          const twitchData = data.data

          if (twitchData.length) {
            client.say(channel, `@${userName}, ${targetUser} ${Strings.subscribedToChannel} ${channel} ${timeFormat(twitchData[0].followed_at)} ${Strings.b}`)
          } else {
            client.say(channel, `@${userName}, ${targetUser} ${Strings.notSubscribed} ${Strings.notLikeThis}`)
          }
        })
        .catch(err => console.error(err))
      }
    })
    .catch(err => console.error(err))

  }
}

module.exports = { old }
