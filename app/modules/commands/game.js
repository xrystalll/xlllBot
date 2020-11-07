const path = require('path')
const config = require(path.join(__dirname, '..', '..', 'config', 'default.json'))
const { twitchApi, checkSettings } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))
const GamesDB = require(path.join(__dirname, '..', 'models', 'GamesDB'))

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
  twitchApi(channel, 'GET', '/games', { urlParams: { name: game } }).then(gameData => {
    if (!gameData.data.length) throw Error

    twitchApi(channel, 'PATCH', '/channels', {
      urlParams: { broadcaster_id: roomId },
      bodyParams: { game_id: gameData.data[0].id }
    }).then(data => {
      if (!data) throw Error

      client.say(channel, `Установлена категория - ${gameData.data[0].name}`)
    })
    .catch(err => client.say(channel, 'Не удалось установить категорию'))
  })
  .catch(err => client.say(channel, 'Не удалось установить категорию'))
}

module.exports = { game }
