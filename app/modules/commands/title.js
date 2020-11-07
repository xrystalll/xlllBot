const path = require('path')
const { twitchApi, checkSettings } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))

const title = (channel, roomId, args) => {
  if (args.length === 0) return

  const status = args.join(' ')

  checkSettings(channel, 'changetitle').then(bool => {
    if (bool) {
      twitchApi(channel, 'PATCH', '/channels', {
        urlParams: { broadcaster_id: roomId },
        bodyParams: { title: status }
      }).then(data => {
        if (!data) throw Error

        client.say(channel, `Установлено название стрима: ${status}`)
      })
      .catch(err => client.say(channel, 'Не удалось установить название стрима'))
    } else client.say(channel, 'Возможность менять название стрима командой выключена!')
  })
}

module.exports = { title }
