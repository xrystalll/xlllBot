const express = require('express')
const router = express.Router()
const path = require('path')

const Mongoose = require('mongoose')
const cachegoose = require('cachegoose')

const UserDB = require(path.join(__dirname, '..', 'modules', 'models', 'UserDB'))
const ChannelsDB = require(path.join(__dirname, '..', 'modules', 'models', 'ChannelsDB'))
const CommandDB = require(path.join(__dirname, '..', 'modules', 'models', 'CommandDB'))
const BadWordsDB = require(path.join(__dirname, '..', 'modules', 'models', 'BadWordsDB'))
const SettingsDB = require(path.join(__dirname, '..', 'modules', 'models', 'SettingsDB'))
const EventsDB = require(path.join(__dirname, '..', 'modules', 'models', 'EventsDB'))
const VideosDB = require(path.join(__dirname, '..', 'modules', 'models', 'VideosDB'))
const InvitesDB = require(path.join(__dirname, '..', 'modules', 'models', 'InvitesDB'))
const GamesDB = require(path.join(__dirname, '..', 'modules', 'models', 'GamesDB'))

const client = require(path.join(__dirname, '..', 'modules', 'client'))
const pubsub = require(path.join(__dirname, '..', 'modules', 'pubSub'))

const AuthProtect = (req, res) => new Promise((resolve, reject) => {
  const auth = req.get('authorization')

  if (!auth) {
    res.set("WWW-Authenticate", "Basic realm='Authorization Required'")
    return reject()
  }

  const credentials = new Buffer.from(auth.split(' ').pop(), 'base64').toString('ascii').split(':')
  const [login, hash] = credentials

  if (!hash && !login) return reject()

  return UserDB.findOne({ login, hash })
    .cache(30, 'cache-userdata-for-' + login)
    .then(data => resolve(data))
    .catch(error => reject())
})

// users api
// get user info
router.get('/api/user', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      res.json({
        twitchId: data.twitchId,
        login: data.login,
        logo: data.logo
      })
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),


// channels api
// get channel data
router.get('/api/channel', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })

      ChannelsDB.find({ name: channel })
        .then(data => {
          if (data.length) {
            res.json(data)
          } else {
            ChannelsDB.create({ name: channel })
              .then(output => res.json([output]))
              .catch(error => res.status(500).json({ error }))
          }
        })
        .catch(error => res.status(500).json({ error: 'Unable to get channel' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),

// get moderators list
router.get('/api/channel/mods', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })

      client.mods(channel)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ error: 'Unable to get list of moderators' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),


// bot
// join bot to chat
router.get('/api/bot/join', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })

      client.join(channel)
        .then(joined => {
          ChannelsDB.updateOne({ name: channel }, { bot_active: true })
            .then(() => {
              pubsub.addTopic([{ topic: 'channel-points-channel-v1.' + data.twitchId, token: data.token }])
                .catch(error => console.error(error))
              res.json({ message: 'Bot joined to chat: ' + joined.join() })
            })
            .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error: 'Unable join to chat' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),

// leave bot from chat
router.get('/api/bot/leave', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })

      client.part(channel)
        .then(leaved => {
          ChannelsDB.updateOne({ name: channel }, { bot_active: false })
            .then(() => {
              pubsub.removeTopic([{ topic: 'channel-points-channel-v1.' + data.twitchId }])
                .catch(error => console.error(error))
              res.json({ message: 'Bot left chat: ' + leaved.join() })
            })
            .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error: 'Unable to leave from chat' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),


// commands api
// get all commands
router.get('/api/commands/all', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })

      CommandDB.find({ channel })
        .cache(0, 'cache-all-commands-for-' + channel)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ error: 'Unable to get list of commands' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),

// create new command
router.put('/api/commands/add', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login
      const { tag, text, countdown } = req.body

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })
      if (!tag || !text || countdown === undefined || !channel) return res.status(400).json({ error: 'Empty request' })
      if (!Number.isInteger(countdown)) return res.status(400).json({ error: 'Countdown must be a number' })

      CommandDB.create({ tag, text, countdown, last_auto_send: Date.now(), channel })
        .then(data => {
          cachegoose.clearCache('cache-all-commands-for-' + channel)
          res.json(data)
        })
        .catch(error => res.status(500).json({ error: 'Unable to add command' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),

// edit command
router.put('/api/commands/edit', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login
      const { id, tag, text, countdown } = req.body

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })
      if (!id || !tag || !text || countdown === undefined || !channel) return res.status(400).json({ error: 'Empty request' })
      if (!Number.isInteger(countdown)) return res.status(400).json({ error: 'Countdown must be a number' })

      CommandDB.updateOne({ _id: Mongoose.Types.ObjectId(id) }, { tag, text, countdown })
        .then(() => {
          cachegoose.clearCache('cache-all-commands-for-' + channel)
          res.json({ success: true })
        })
        .catch(error => res.status(500).json({ error: 'Unable to edit command' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),

// delete command
router.put('/api/commands/delete', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login
      const { id } = req.body

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })
      if (!id) return res.status(400).json({ error: 'Empty request' })

      CommandDB.deleteOne({ _id: Mongoose.Types.ObjectId(id), channel })
        .then(data => {
          cachegoose.clearCache('cache-all-commands-for-' + channel)
          res.json({ success: true, deletedCount: data.deletedCount })
        })
        .catch(error => res.status(500).json({ error: 'Unable to delete command' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),


// badWords api
router.get('/api/words/all', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })

      BadWordsDB.find({ channel })
        .cache(0, 'cache-all-badwords-for-' + channel)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ error: 'Unable to get list of badwords' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),

// add new word
router.put('/api/words/add', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login
      const { word, duration } = req.body

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })
      if (!word || !duration || !channel) return res.status(400).json({ error: 'Empty request' })
      if (!Number.isInteger(duration)) return res.status(400).json({ error: 'Duration must be a number' })
      if (duration === 0) return res.status(400).json({ error: 'Duration must be greater then zero' })

      BadWordsDB.create({ word, duration, channel })
        .then(data => {
          cachegoose.clearCache('cache-all-badwords-for-' + channel)
          res.json(data)
        })
        .catch(error => res.status(500).json({ error: 'Unable to add badword' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),

// delete word
router.put('/api/words/delete', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login
      const { id } = req.body

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })
      if (!id) return res.status(400).json({ error: 'Empty request' })

      BadWordsDB.deleteOne({ _id: Mongoose.Types.ObjectId(id), channel })
        .then(data => {
          cachegoose.clearCache('cache-all-badwords-for-' + channel)
          res.json({ success: true, deletedCount: data.deletedCount })
        })
        .catch(error => res.status(500).json({ error: 'Unable to delete badword' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),


// settings api
// get all settings
router.get('/api/settings/all', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })

      SettingsDB.find({ channel })
        .then(data => {
          if (data.length) {
            res.json(data)
          } else {
            const defaultSettings = [
              {
                sort: 1,
                name: 'pingpong',
                state: true,
                description: 'Мини-игра пинг понг',
                channel
              }, {
                sort: 2,
                name: 'cocksize',
                state: true,
                description: 'Мини-игра "Размер..."',
                channel
              }, {
                sort: 3,
                name: 'links',
                state: true,
                description: 'Запретить писать ссылки в чат ансабам. Удаление сообщения и таймаут на 10 секунд',
                channel
              }, {
                sort: 4,
                name: 'songrequest',
                state: true,
                description: 'Заказ видео в чате',
                channel
              }, {
                sort: 5,
                name: 'songforunsub',
                state: false,
                description: 'Разрешить заказ видео ансабам',
                channel
              }, {
                sort: 6,
                name: 'songforpoints',
                state: false,
                description: 'Заказ видео за баллы канала (Не включайте если баллы на канале отключены или недоступны)',
                channel
              }, {
                sort: 7,
                name: 'songforpointsprice',
                state: false,
                value: 1000,
                description: 'Цена в баллах канала за заказ видео',
                channel
              }, {
                sort: 8,
                name: 'changegame',
                state: true,
                description: 'Смена категории стрима командой',
                channel
              }, {
                sort: 9,
                name: 'changetitle',
                state: true,
                description: 'Смена названия стрима командой',
                channel
              }, {
                sort: 10,
                name: 'poll',
                state: true,
                description: 'Создание голосования командой',
                channel
              }, {
                sort: 11,
                name: 'subscription',
                state: true,
                description: 'Уведомлять в чате о новый подписке',
                channel
              }, {
                sort: 12,
                name: 'resub',
                state: true,
                description: 'Уведомлять в чате о переподписке',
                channel
              }, {
                sort: 13,
                name: 'subgift',
                state: true,
                description: 'Уведомлять в чате о подарочной подписке',
                channel
              }, {
                sort: 14,
                name: 'giftpaidupgrade',
                state: true,
                description: 'Уведомлять в чате о продлении подарочной подписки',
                channel
              }, {
                sort: 15,
                name: 'anongiftpaidupgrade',
                state: true,
                description: 'Уведомлять в чате о продлении анонимной подарочной подписки',
                channel
              }, {
                sort: 16,
                name: 'raided',
                state: true,
                description: 'Уведомлять в чате о рейде',
                channel
              }, {
                sort: 17,
                name: 'cheer',
                state: true,
                description: 'Уведомлять в чате о донате битс',
                channel
              }
            ]
            SettingsDB.insertMany(defaultSettings)
              .then(output => res.json(output))
              .catch(error => res.status(500).json({ error }))
          }
        })
        .catch(error => res.status(500).json({ error: 'Unable to get list of settings' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),

// toggle setting state
router.put('/api/settings/toggle', (req, res) => {
  AuthProtect(req, res)
    .then(data => {
      if (!data) throw Error

      const channel = data.login
      const { name, state, value } = req.body

      if (!channel) return res.status(400).json({ error: 'Channel name does not exist' })
      if (!name || state === undefined || !channel) return res.status(400).json({ error: 'Empty request' })
      if (typeof state !== 'boolean') res.status(400).json({ error: 'State must be boolean' })
      if (!!value) {
        if (!Number.isInteger(value)) return res.status(400).json({ error: 'Value must be a number' })
      }

      SettingsDB.updateOne({ name, channel }, { state, value })
        .then(() => {
          cachegoose.clearCache('cache-setting-' + name + '-for-' + channel)
          res.json({ success: true, state, value })
        })
        .catch(error => res.status(500).json({ error: 'Unable to save setting' }))
    })
    .catch(error => res.status(401).json({ error: 'Access Denied' }))
}),


// games api
router.get('/api/games', (req, res) => {
  GamesDB.find()
    .cache(0, 'cache-all-games')
    .then(data => {
      if (data.length) {
        res.json(data)
      } else {
        const defaultGames = [
          {
            game: 'Just Chatting',
            short: 'jc'
          }, {
            game: 'Games + Demos',
            short: 'demo'
          }, {
            game: 'Art',
            short: 'art'
          }, {
            game: 'Science & Technology',
            short: 'science'
          }, {
            game: 'Marbles On Stream',
            short: 'marbles'
          }, {
            game: 'Fortnite',
            short: 'fortnite'
          }, {
            game: 'PLAYERUNKNOWN\'S BATTLEGROUNDS',
            short: 'pubg'
          }, {
            game: 'Apex Legends',
            short: 'apex'
          }, {
            game: 'Overwatch',
            short: 'overwatch'
          }, {
            game: 'Counter-Strike: Global Offensive',
            short: 'csgo'
          }, {
            game: 'Valorant',
            short: 'valorant'
          }, {
            game: 'League of Legends',
            short: 'lol'
          }, {
            game: 'Dota 2',
            short: 'dota2'
          }, {
            game: 'World of Warcraft',
            short: 'wow'
          }, {
            game: 'Hearthstone',
            short: 'hearthstone'
          }, {
            game: 'Tom Clancy\'s Rainbow Six: Siege',
            short: 'rainbowsix'
          }, {
            game: 'Rocket League',
            short: 'rocketleague'
          }, {
            game: 'Minecraft',
            short: 'minecraft'
          }, {
            game: 'Dead by Daylight',
            short: 'dbd'
          }, {
            game: 'Grand Theft Auto III',
            short: 'gta3'
          }, {
            game: 'Grand Theft Auto: Vice City',
            short: 'gtavc'
          }, {
            game: 'Grand Theft Auto: San Andreas',
            short: 'gtasa'
          }, {
            game: 'Grand Theft Auto IV',
            short: 'gta4'
          }, {
            game: 'Grand Theft Auto V',
            short: 'gta5'
          }, {
            game: 'Escape From Tarkov',
            short: 'tarkov'
          }, {
            game: 'Rust',
            short: 'rust'
          }, {
            game: 'Path of Exile',
            short: 'poe'
          }, {
            game: 'The Witcher 3: Wild Hunt',
            short: 'witcher3'
          }, {
            game: 'Cyberpunk 2077',
            short: 'cyberpunk'
          }, {
            game: 'Dead Space 3',
            short: 'deadspace3'
          }, {
            game: 'Dead Space 2',
            short: 'deadspace2'
          }, {
            game: 'Dead Space',
            short: 'deadspace'
          }, {
            game: 'Death Stranding',
            short: 'deathstranding'
          }, {
            game: 'Outlast',
            short: 'outlast'
          }, {
            game: 'Outlast 2',
            short: 'outlast2'
          }, {
            game: 'Raft',
            short: 'raft'
          }, {
            game: 'Warface',
            short: 'warface'
          }, {
            game: 'DayZ',
            short: 'dayz'
          }, {
            game: 'Sea of Thieves',
            short: 'seaofthieves'
          }, {
            game: 'Dark Souls III',
            short: 'darksouls3'
          }, {
            game: 'Red Dead Redemption',
            short: 'rdr'
          }, {
            game: 'Red Dead Redemption 2',
            short: 'rdr2'
          }, {
            game: 'VRChat',
            short: 'vrchat'
          }, {
            game: 'Terraria',
            short: 'terraria'
          }, {
            game: 'osu!',
            short: 'osu'
          }, {
            game: 'The Sims 4',
            short: 'sims4'
          }, {
            game: 'Among Us',
            short: 'amongus'
          }, {
            game: 'Fall Guys',
            short: 'fallguys'
          }, {
            game: 'Brawl Stars',
            short: 'brawlstars'
          }
        ]
        GamesDB.insertMany(defaultGames)
          .then(output => res.json(output))
          .catch(error => res.status(500).json({ error }))
      }
    })
    .catch(error => res.status(500).json({ error: 'Unable to get list of games' }))
}),


// invite api
router.get('/api/invite/add', (req, res) => {
  const { channel } = req.query

  if (!channel) return res.status(400).json({ error: 'Empty request' })

  InvitesDB.findOrCreate({ channel })
    .then(data => res.json(data))
    .catch(error => res.status(500).json({ error: 'Unable to create invite' }))
}),


// error 404
router.get('*', (req, res) => {
  res.status(404).json({ error: '404 Not found' })
})

module.exports = router
