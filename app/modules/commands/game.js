const path = require('path')
const config = require(path.join(__dirname, '..', '..', 'config', 'default.json'))
const { checkSettings } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))
const GamesDB = require(path.join(__dirname, '..', 'models', 'GamesDB'))
const request = require('request')

const game = (channel, roomId, args) => {
  const short = args[0]

  if (!short) return

  checkSettings(channel, 'changegame').then(bool => {
    if (bool) {
      GamesDB.find({ short })
        .then(data => {
          if (!!data.length) {
            setGame(channel, roomId, data[0].game)
          } else {
            setGame(channel, roomId, args.join(' '))
          }
        })
        .catch(err => console.error(err))
    } else client.say(channel, 'Возможность менять категорию стрима командой выключена!')
  })
}

const setGame = (channel, roomId, game) => {
  const streamObject = {"channel": { game, "channel_feed_enabled": true }}

  request({
    method: 'PUT',
    url: 'https://api.twitch.tv/kraken/channels/' + roomId,
    headers: {
      Authorization: 'OAuth ' + config.bot.oauth_token,
      'Client-ID': config.bot.client_id,
      Accept: 'application/vnd.twitchtv.v5+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(streamObject)
  }, (err, res, body) => {
    if (err) return

    client.say(channel, `Установлена категория - ${game}`)
  })
}

module.exports = { game }
