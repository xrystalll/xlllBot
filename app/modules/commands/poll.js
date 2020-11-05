const path = require('path')
const { checkSettings } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))
const request = require('request')

const poll = (channel, args) => {
  checkSettings(channel, 'poll').then(bool => {
    if (bool) {
      if (args.length < 3) return

      const title = args[0]
      args.splice(0, 2)
      const str = args.join(' ')
      const options = str.split(' | ')
      const pollObject = { title, options }

      if (options.length < 2) return client.say(channel, 'Команда введена неверно!')

      request({
        method: 'POST',
        url: 'https://www.strawpoll.me/api/v2/polls',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pollObject)
      }, (err, res, body) => {
        if (err) return

        if (res && res.statusCode === 200) {
          const data = JSON.parse(body)

          client.action(channel, `${title} - Голосовать тут https://www.strawpoll.me/${data.id}`)
        }
      })
    } else client.say(channel, 'Возможность создавать голосования выключена!')
  })
}

module.exports = { poll }
