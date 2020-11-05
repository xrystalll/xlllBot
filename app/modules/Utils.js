const path = require('path')
const SettingsDB = require(path.join(__dirname, 'models', 'SettingsDB'))

const parseCommand = (message = '') => {
  const regex = /!(.*?)$/gm
  const fullCommand = regex.exec(message)

  if (fullCommand) {
    const args = fullCommand[1].split(' ')
    const command = args[0]
    args.shift()

    return { command, args }
  }

  return false
}

const checkSettings = (channel = '', settName) => {
  return SettingsDB.findOne({ channel: channel.toLowerCase().replace('#', ''), name: settName })
    .cache(0, 'cache-setting-' + settName + '-for-' + channel.toLowerCase().replace('#', ''))
    .then(data => !!data.state)
    .catch(err => false)
}

const declOfNum = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
}

const timeFormat = (date) => {
  let totalSeconds = (Date.now() - new Date(date).getTime()) / 1000

  const year = Math.floor(totalSeconds / 31536000)
  totalSeconds %= 31536000
  const days = Math.floor(totalSeconds / 86400)
  totalSeconds %= 86400
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)

  return `${
    year > 0 ? year + declOfNum(year, [' год ', ' года ', ' лет ']) : ''}${
    days > 0 ? days + declOfNum(days, [' день ', ' дня ', ' дней ']) : ''}${
    hours > 0 ? hours + declOfNum(hours, [' час ', ' часа ', ' часов ']) : ''}${
    minutes > 0 ? minutes + declOfNum(minutes, [' минуту', ' минуты', ' минут']) : ''
  }`
}

const checkUrl = (url) => url.match(/(https?:\/\/[^\s]+)/g) != null;

const checkYTUrl = (url) => url.match(/^.*((youtu.be\/)|(v\/)|(\/\w\/)|(watch\?))\??v?=?([^#\&\?]*).*/g) != null;

const youtubeId = (url) => {
  const match = url.match(/^.*((youtu.be\/)|(v\/)|(\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/)
  return (match && match[7].length === 11) ? match[7] : false
}

module.exports = { parseCommand, checkSettings, declOfNum, timeFormat, checkUrl, checkYTUrl, youtubeId }
