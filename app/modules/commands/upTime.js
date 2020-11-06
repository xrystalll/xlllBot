const path = require('path')
const config = require(path.join(__dirname, '..', '..', 'config', 'default.json'))
const { timeFormat } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))
const UserDB = require(path.join(__dirname, '..', 'models', 'UserDB'))
const request = require('request')

const upTime = (channel, roomId) => {
  UserDB.findOne({ login: channel })
    .then(data => {
      request({
        method: 'GET',
        url: 'https://api.twitch.tv/helix/streams?user_id=' + roomId,
        headers: {
          Authorization: 'Bearer ' + data.token,
          'Client-ID': config.bot.client_id
        }
      }, (err, res, body) => {
        if (err) return

        const streamObj = JSON.parse(body)
        const stream = streamObj.data

        if (stream.length) client.say(channel, `Стрим начался ${timeFormat(stream[0].started_at)} назад`)
        else client.say(channel, 'Стрим оффлайн')
      })
    })
}

module.exports = { upTime }
