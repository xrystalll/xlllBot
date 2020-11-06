const path = require('path')
const config = require(path.join(__dirname, '..', '..', 'config', 'default.json'))
const { checkSettings } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))
const UserDB = require(path.join(__dirname, '..', 'models', 'UserDB'))
const request = require('request')

const title = (channel, roomId, args) => {
  if (args.length === 0) return

  const status = args.join(' ')

  checkSettings(channel, 'changetitle').then(bool => {
    if (bool) {
      UserDB.findOne({ login: channel })
        .then(data => {
          request({
            method: 'PATCH',
            url: 'https://api.twitch.tv/helix/channels?broadcaster_id=' + roomId,
            headers: {
              Authorization: 'Bearer ' + data.token,
              'Client-ID': config.bot.client_id,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: status })
          }, (err) => {
            if (err) return

            client.say(channel, `Установлено название стрима: ${status}`)
          })
        })
        .catch(error => client.say(channel, 'Не удалось установить название стрима'))
    } else client.say(channel, 'Возможность менять название стрима командой выключена!')
  })
}

module.exports = { title }
