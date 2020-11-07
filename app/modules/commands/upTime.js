const path = require('path')
const { twitchApi, timeFormat } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))

const upTime = (channel, roomId) => {
  twitchApi(channel, 'GET', '/streams', { urlParams: { user_id: roomId } }).then(streamData => {
    if (!streamData) return

    if (streamData.data.length) client.say(channel, `Стрим начался ${timeFormat(streamData.data[0].started_at)} назад`)
    else client.say(channel, 'Стрим оффлайн')
  })
  .catch(err => console.error(err))
}

module.exports = { upTime }
