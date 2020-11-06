const path = require('path')
const config = require(path.join(__dirname, '..', '..', 'config', 'default.json'))
const { checkSettings } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))
const UserDB = require(path.join(__dirname, '..', 'models', 'UserDB'))
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
  UserDB.findOne({ login: channel })
    .then(data => {
      request({
        method: 'GET',
        url: 'https://api.twitch.tv/helix/games?name=' + encodeURIComponent(game.toLowerCase()),
        headers: {
          Authorization: 'Bearer ' + data.token,
          'Client-ID': config.bot.client_id
        }
      }, (err, res, body) => {
        const gameObj = JSON.parse(body)

        if (err || !gameObj.data.length) {
          client.say(channel, 'Не удалось установить категорию')
          return
        }

        request({
          method: 'PATCH',
          url: 'https://api.twitch.tv/helix/channels?broadcaster_id=' + roomId,
          headers: {
            Authorization: 'Bearer ' + data.token,
            'Client-ID': config.bot.client_id,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ game_id: gameObj.data[0].id })
        }, (err) => {
          if (err) return

          client.say(channel, `Установлена категория - ${gameObj.data[0].name}`)
        })
      })
    })
    .catch(error => client.say(channel, 'Не удалось установить категорию'))
}

module.exports = { game }
