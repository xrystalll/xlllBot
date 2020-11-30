const path = require('path')
const Strings = require(path.join(__dirname, '..', '..', 'config', 'strings.json'))
const { twitchApi, timeFormat } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))

const upTime = (channel, roomId) => {
  twitchApi(channel, 'GET', '/streams', { urlParams: { user_id: roomId } }).then(streamData => {
    if (!streamData) return

    if (streamData.data.length) client.say(channel, `${Strings.streamStarted} ${timeFormat(streamData.data[0].started_at)} ${Strings.ago}`)
    else client.say(channel, Strings.streamOffline)
  })
  .catch(err => console.error(err))
}

module.exports = { upTime }
