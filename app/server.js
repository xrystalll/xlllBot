const path = require('path')
const config = require(path.join(__dirname, 'config', 'default.json'))

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const port = process.env.PORT || 1337

const routes = require(path.join(__dirname, 'routes'))

const cachegoose = require('cachegoose')

const session = require('express-session')
const passport = require('passport')
const { OAuth2Strategy } = require('passport-oauth')

const bodyParser = require('body-parser')
const RateLimit = require('express-rate-limit')
const cors = require('cors')
const hpp = require('hpp')
const helmet = require('helmet')
const xssFilter = require('x-xss-protection')

const { checkSettings, declOfNum, checkUrl, checkYTUrl } = require(path.join(__dirname, 'modules', 'Utils'))
const request = require('request')
const crypto = require('crypto')

const Mongoose = require('mongoose')
require(path.join(__dirname, 'modules', 'DB'))
const UserDB = require(path.join(__dirname, 'modules', 'models', 'UserDB'))
const CommandDB = require(path.join(__dirname, 'modules', 'models', 'CommandDB'))
const BadWordsDB = require(path.join(__dirname, 'modules', 'models', 'BadWordsDB'))
const VideosDB = require(path.join(__dirname, 'modules', 'models', 'VideosDB'))
const InvitesDB = require(path.join(__dirname, 'modules', 'models', 'InvitesDB'))
const EventsDB = require(path.join(__dirname, 'modules', 'models', 'EventsDB'))
const SettingsDB = require(path.join(__dirname, 'modules', 'models', 'SettingsDB'))

const client = require(path.join(__dirname, 'modules', 'client'))
const CommandResolver = require(path.join(__dirname, 'modules', 'CommandResolver'))

const pubsub = require(path.join(__dirname, 'modules', 'pubSub'))
const { createVideo } = require(path.join(__dirname, 'modules', 'commands', 'video'))

client.connect()

client.on('chat', (sharpChannel, user, message, self) => {
  if (self) return

  const channel = sharpChannel.toLowerCase().replace('#', '')

  if (message.toLowerCase().indexOf('!sr') === -1 && !user.subscriber && !user.mod && user.username !== channel && checkUrl(message)) {
    checkSettings(channel, 'links').then(bool => {
      if (bool) {
        client.deletemessage(channel, user.id).catch(err => console.error(err))
        client.timeout(channel, user.username, '10').catch(err => console.error(err))
      }
    })
  }

  BadWordsDB.find({ channel })
    .cache(0, 'cache-all-badwords-for-' + channel)
    .then(data => {
      data.map(i => {
        if (message.toLowerCase().includes(i.word)) {
          client.deletemessage(channel, user.id).catch(err => console.error(err))
          client.timeout(channel, user.username, i.duration).catch(err => console.error(err))
        }
      })
    })
    .catch(err => console.error(err))

  if (message.indexOf('@' + config.bot.username) !== -1) {
    client.say(channel, `@${user.username} больше мне не пиши бля от тебя гавной воняет`)
  }

  CommandDB.find({ channel })
    .cache(0, 'cache-all-commands-for-' + channel)
    .then(data => {
      data.map(i => {
        if (i.countdown === 0) return

        if (i.last_auto_send * 1 + i.countdown * 1000 < Date.now()) {
          client.say(channel, i.text)

          CommandDB.updateOne({ channel, tag: i.tag }, { last_auto_send: Date.now() })
            .then(() => {
              cachegoose.clearCache('cache-all-commands-for-' + channel)
            })
            .catch(err => console.error(err))
        }
      })
    })
    .catch(err => console.error(err))

  if (message.indexOf('!') !== -1) {
    CommandResolver.resolve(channel, user, message.replace(/(<([^>]+)>)/ig, ''), io)
  }
})

// подписка
client.on('subscription', (channel, user, method, message, userstate) => {
  const prime = method.prime
  let plan
  switch (method.plan) {
    case '1000': plan = ' 1 уровня'
      break
    case '2000': plan = ' 2 уровня'
      break
    case '3000': plan = ' 3 уровня'
      break
  }
  const text = `@${user} спасибо за${prime ? ' Twitch Prime' : ''} подписку${plan || ''} Kreygasm`
  const event = `${user} осуществляет подписку${plan || ''}${prime ? ' с помощью Twitch Prime' : ''}`
  checkSettings(channel, 'subscription').then(bool => {
    if (bool) client.say(channel, text)
  })
  EventsDB.create({ channel: channel.substr(1), text: event, time: Date.now() })
    .then(data => io.sockets.emit('new_event', data))
    .catch(err => console.error(err))
})

// переподписка
client.on('resub', (channel, user, months, message, userstate, method) => {
  const cumulativeMonths = userstate['msg-param-cumulative-months']
  let plan
  switch (method.plan) {
    case '1000': plan = ' 1 уровня'
      break
    case '2000': plan = ' 2 уровня'
      break
    case '3000': plan = ' 3 уровня'
      break
  }
  if (cumulativeMonths) {
    const text = `@${user} спасибо за ${cumulativeMonths} ${declOfNum(cumulativeMonths, ['месяц', 'месяца', 'месяцев'])} переподписки${plan || ''} Kreygasm`
    const event = `${user} осуществляет переподписку${plan || ''} сроком ${cumulativeMonths} ${declOfNum(cumulativeMonths, ['месяц', 'месяца', 'месяцев'])}`
    checkSettings(channel, 'resub').then(bool => {
      if (bool) client.say(channel, text)
    })
    EventsDB.create({ channel: channel.substr(1), text: event, time: Date.now() })
      .then(data => io.sockets.emit('new_event', data))
      .catch(err => console.error(err))
  } else {
    const text = `@${user} спасибо за переподписку${plan || ''} Kreygasm`
    const event = `${user} осуществляет переподписку${plan || ''}`
    checkSettings(channel, 'resub').then(bool => {
      if (bool) client.say(channel, text)
    })
    EventsDB.create({ channel: channel.substr(1), text: event, time: Date.now() })
      .then(data => io.sockets.emit('new_event', data))
      .catch(err => console.error(err))
  }
})

// подарочная подписка
client.on('subgift', (channel, user, streakMonths, recipient, method, userstate) => {
  const recipientUser = userstate['msg-param-recipient-display-name']
  let plan
  switch (method.plan) {
    case '1000': plan = ' 1 уровня'
      break
    case '2000': plan = ' 2 уровня'
      break
    case '3000': plan = ' 3 уровня'
      break
  }
  const text = `${user} дарит подписку${plan || ''} @${recipientUser} PogChamp`
  const event = `${user} дарит подписку${plan || ''} ${recipientUser}`
  checkSettings(channel, 'subgift').then(bool => {
    if (bool) client.say(channel, text)
  })
  EventsDB.create({ channel: channel.substr(1), text: event, time: Date.now() })
    .then(data => io.sockets.emit('new_event', data))
    .catch(err => console.error(err))
})

// продление подарочной подписки
client.on('giftpaidupgrade', (channel, user, sender, userstate) => {
  const text = `${user} продлевает подарочную подписку Kreygasm`
  const event = `${user} продлевает подарочную подписку`
  checkSettings(channel, 'giftpaidupgrade').then(bool => {
    if (bool) client.say(channel, text)
  })
  EventsDB.create({ channel: channel.substr(1), text: event, time: Date.now() })
    .then(data => io.sockets.emit('new_event', data))
    .catch(err => console.error(err))
})

// продление анонимной подарочной подписки
client.on('anongiftpaidupgrade', (channel, user, userstate) => {
  const text = `@${user} спасибо за переподписку Kreygasm`
  const event = `${user} продлевает анонимную подарочную подписку`
  checkSettings(channel, 'anongiftpaidupgrade').then(bool => {
    if (bool) client.say(channel, text)
  })
  EventsDB.create({ channel: channel.substr(1), text: event, time: Date.now() })
    .then(data => io.sockets.emit('new_event', data))
    .catch(err => console.error(err))
})

// рейд
client.on('raided', (channel, user, viewers) => {
  const text = `twitchRaid ${user} и его ${viewers} ${declOfNum(viewers, ['зритель', 'зрителя', 'зрителей'])} проводят рейд twitchRaid`
  const event = `${user} и его ${viewers} ${declOfNum(viewers, ['зритель', 'зрителя', 'зрителей'])} проводят рейд`
  checkSettings(channel, 'raided').then(bool => {
    if (bool) client.say(channel, text)
  })
  EventsDB.create({ channel: channel.substr(1), text: event, time: Date.now() })
    .then(data => io.sockets.emit('new_event', data))
    .catch(err => console.error(err))
})

// битсы
client.on('cheer', (channel, userstate, message) => {
  const text = `@${userstate['display-name']} спасибо за ${userstate.bits} ${declOfNum(userstate.bits, ['битс', 'битса', 'битс'])} TehePelo`
  const event = `${userstate['display-name']} дарит ${userstate.bits} ${declOfNum(userstate.bits, ['битс', 'битса', 'битс'])}`
  checkSettings(channel, 'cheer').then(bool => {
    if (bool) client.say(channel, text)
  })
  EventsDB.create({ channel: channel.substr(1), text: event, time: Date.now() })
    .then(data => io.sockets.emit('new_event', data))
    .catch(err => console.error(err))
})

// заказ видео за баллы канала
pubsub.on('channel-points', (data) => {
  if (data.redemption.user_input.toLowerCase().indexOf('!sr') === -1) return
  if (!checkYTUrl(data.redemption.user_input)) return

  UserDB.findOne({ twitchId: data.redemption.channel_id })
    .then(user => {
      const channel = user.login

      checkSettings(channel, 'songrequest').then(bool => {
        if (bool) {
          checkSettings(channel, 'songforpoints').then(setting => {
            if (setting) {
              SettingsDB.findOne({ channel, name: 'songforpointsprice' })
                .then(price => {
                  if (data.redemption.reward.cost < price.value) {
                    const text = `@${data.redemption.user.login} стоимость заказа видео ${price.value} ${declOfNum(price.value, ['балл', 'балла', 'баллов'])}!`
                    client.say(channel, text)
                    return
                  }

                  createVideo({
                    url: data.redemption.user_input,
                    channel,
                    username: data.redemption.user.login,
                    price: data.redemption.reward.cost
                  }, io)
                })
                .catch(err => console.error(err))
            }
          })
        } else client.say(channel, 'Возможность заказывать видео выключена!')
      })
    })
})

pubsub.on('error', (data) => {
  console.error(data)
})

const limiter = new RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests per minute' }
})

app.use('/api/', limiter),

app.use(express.static(path.join(__dirname, '..', 'build')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})
app.get('/auth/error', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

app.use(session({
  secret: crypto.createHash('md5').update(Math.random().toString(36).substring(3)).digest('hex'),
  cookie: { httpOnly: true, sameSite: true },
  resave: false,
  saveUninitialized: false
})),
app.use(bodyParser.json()),
app.use(passport.initialize()),
app.use(passport.session()),
app.use(hpp()),
app.use(helmet.noSniff()),
app.use(xssFilter()),
app.use(cors({
  origin: config.clientEndPoint,
  credentials: true
})),

// twitch auth
OAuth2Strategy.prototype.userProfile = (accessToken, next) => {
  request({
    method: 'GET',
    url: 'https://api.twitch.tv/helix/users',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Client-ID': config.bot.client_id,
      Accept: 'application/vnd.twitchtv.v5+json'
    }
  }, (err, res, data) => {
    if (res && res.statusCode === 200) {
      next(null, JSON.parse(data))
    } else {
      next(JSON.parse(data))
    }
  })
},

passport.use('twitch', new OAuth2Strategy({
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  clientID: config.bot.client_id,
  clientSecret: config.auth.secret,
  callbackURL: config.auth.callback_url,
  scope: ['user:read:email', 'channel:read:redemptions', 'user:edit:broadcast'],
  state: true
}, (accessToken, refreshToken, profile, next) => {
  profile.accessToken = accessToken
  profile.refreshToken = refreshToken
  const data = profile.data[0]
  const channel = data.login

  if (!channel) return next({ error: 'Channel name does not exist' })

  InvitesDB.findOne({ channel })
    .then(res => {
      if (res && res.channel === data.login) {
        UserDB.findOrCreate({
          twitchId: data.id,
          login: data.login
        })
        return next(null, profile)
      } else {
        return next({ error: 'Account not found in invite list' })
      }
    })
    .catch(err => console.error(err))
})),

passport.serializeUser((user, next) => {
  next(null, user)
}),

passport.deserializeUser((user, next) => {
  next(null, user)
}),

app.get('/auth/twitch', passport.authenticate('twitch')),

app.get('/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: config.clientEndPoint + '/auth/error' }), (req, res) => {
  if (!req.session.passport) return res.status(401).redirect(config.clientEndPoint + '/auth/error')

  const { id } = req.session.passport.user.data[0]

  if (!id) return res.status(401).redirect(config.clientEndPoint + '/auth/error')

  const token = req.session.passport.user.accessToken
  const hash = crypto.createHash('md5').update(req.session.passport.user.refreshToken + 'is' + req.session.passport.user.data[0].login).digest('hex')
  const logo = req.session.passport.user.data[0].profile_image_url

  UserDB.updateOne({ twitchId: id }, { token, hash, logo })
    .then(() => {
      UserDB.find({ twitchId: id })
        .then(data => {
          const maxAge = 1000 * 60 * 60 * 24
          res.cookie('login', data[0].login, { maxAge })
          res.cookie('logo', data[0].logo, { maxAge })
          res.cookie('token', hash, { maxAge })

          io.sockets.emit('auth', { auth: true })

          res.redirect(config.clientEndPoint + '/auth')
        })
        .catch(error => res.status(401).redirect(config.clientEndPoint + '/auth/error'))
    })
    .catch(error => res.status(401).redirect(config.clientEndPoint + '/auth/error'))
}),

app.use('/', routes),

io.on('connection', (socket) => {
  socket.on('video_items', (data) => {
    const { channel } = data

    if (!channel) return socket.emit('alert', { message: 'Channel does not exist', type: 'error' })

    VideosDB.find({ channel })
      .cache(0, 'cache-all-videos-for-' + channel)
      .then(data => socket.emit('output_videos', data))
      .catch(() => socket.emit('alert', { message: 'Failed to output all videos', type: 'error' }))
  }),

  socket.on('delete_video', (data) => {
    const { id, channel } = data

    if (!id && !channel) return socket.emit('alert', { message: 'Channel does not exist', type: 'error' })

    VideosDB.deleteOne({ _id: Mongoose.Types.ObjectId(id), channel })
      .then(() => {
        cachegoose.clearCache('cache-all-videos-for-' + channel)
        socket.emit('deteted', { id })
      })
      .catch(() => socket.emit('alert', { message: 'Failed to delete video', type: 'error' }))
  }),

  socket.on('event_items', (data) => {
    const channel = data.channel

    if (!channel) return socket.emit('alert', { message: 'Channel does not exist', type: 'error' })

    EventsDB.find({ channel })
      .then(data => socket.emit('output_events', data))
      .catch(() => socket.emit('alert', { message: 'Failed to output all events', type: 'error' }))
  }),

  socket.on('delete_events', (data) => {
    const { channel } = data

    if (!channel) return socket.emit('alert', { message: 'Channel does not exist', type: 'error' })

    EventsDB.deleteMany({ channel })
      .then(data => socket.emit('events_deleted', { deletedCount: data.deletedCount }))
      .catch(error => socket.emit('alert', { message: 'Failed to delete events', type: 'error' }))
  })
}),

server.listen(port, () => console.log('Server running on port ' + port))
