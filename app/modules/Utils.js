const path = require('path')
const config = require(path.join(__dirname, '..', 'config', 'default.json'))
const Strings = require(path.join(__dirname, '..', 'config', 'strings.json'))
const SettingsDB = require(path.join(__dirname, 'models', 'SettingsDB'))
const UserDB = require(path.join(__dirname, 'models', 'UserDB'))
const request = require('request')

const twitchApi = (channel, method, api, params = null) => new Promise((resolve, reject) => {
  if (!channel && !method && !api) return reject()

  const baseApiUrl = 'https://api.twitch.tv/helix'
  const query = !!params.urlParams
    ? Object.keys(params.urlParams).map(key => key + '=' + encodeURIComponent(params.urlParams[key].toLowerCase())).join('&')
    : ''
  const url = !!query ? baseApiUrl + api + '?' + query : baseApiUrl + api

  const options = (method, url, token, body = null) => {
    const optionsObj = {
      method,
      url,
      headers: {
        Authorization: 'Bearer ' + token,
        'Client-ID': config.bot.client_id
      }
    }

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      optionsObj.headers['Content-Type'] = 'application/json'
      if (!!body) {
        optionsObj.body = JSON.stringify(body)
      }
    }

    return optionsObj
  }

  UserDB.findOne({ login: channel })
    .cache(30, 'cache-userdata-for-' + channel)
    .then(user => {
      request(options(method, url, user.token, params.bodyParams), (err, res, body) => {
        if (err) return reject(err)

        const data = JSON.parse(body + '' || '{}')

        if (!body.error) {
          resolve(data)
        } else {
          reject(res.statusMessage)
        }
      })
    })
    .catch(err => reject(err))
})

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
    year > 0 ? year + declOfNum(year, [` ${Strings.year} `, ` ${Strings.years} `, ` ${Strings.manyYears} `]) : ''}${
    days > 0 ? days + declOfNum(days, [` ${Strings.day} `, ` ${Strings.days} `, ` ${Strings.manyDays} `]) : ''}${
    hours > 0 ? hours + declOfNum(hours, [` ${Strings.hour} `, ` ${Strings.hours} `, ` ${Strings.manyHours} `]) : ''}${
    minutes > 0 ? minutes + declOfNum(minutes, [` ${Strings.minute}`, ` ${Strings.minutes}`, ` ${Strings.manyMinutes}`]) : ''
  }`
}

const checkUrl = (url) => url.match(/(https?:\/\/[^\s]+)/g) != null;

const checkYTUrl = (url) => url.match(/^.*((youtu.be\/)|(v\/)|(\/\w\/)|(watch\?))\??v?=?([^#\&\?]*).*/g) != null;

const youtubeId = (url) => {
  const match = url.match(/^.*((youtu.be\/)|(v\/)|(\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/)
  return (match && match[7].length === 11) ? match[7] : false
}

module.exports = { twitchApi, parseCommand, checkSettings, declOfNum, timeFormat, checkUrl, checkYTUrl, youtubeId }
