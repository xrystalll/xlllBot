const path = require('path')
const config = require(path.join(__dirname, '..', 'config', 'default.json'))
const TwitchPS = require(path.join(__dirname, 'libs', 'TwitchPS'))

const pubsub = new TwitchPS({
  debug: config.options.debug,
  reconnect: config.connection.reconnect,
  init_topics: [{
    topic: 'video-playback.twitch'
  }]
})

setTimeout(() => {
  pubsub.removeTopic([{ topic: 'video-playback.twitch' }])
    .catch(error => console.error(error))
}, 3000)

module.exports = pubsub
