const path = require('path')
const { checkSettings, checkYTUrl, youtubeId } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))
const VideosDB = require(path.join(__dirname, '..', 'models', 'VideosDB'))
const ytInfo = require('updated-youtube-info')
const cachegoose = require('cachegoose')

const createVideo = ({ url, channel, username, price }, io) => {
  if (!url) return
  if (!checkYTUrl(url)) return

  const id = youtubeId(url)
  if (!id) return

  ytInfo(id)
    .then(ytData => {
      const vidObj = {
        from: { username, price },
        yid: ytData.videoId,
        url: ytData.url,
        channel,
        title: ytData.title,
        owner: ytData.owner,
        views: parseInt(ytData.views),
        duration: parseInt(ytData.duration),
        thumb: ytData.thumbnailUrl
      }

      VideosDB.create(vidObj)
        .then(data => {
          cachegoose.clearCache('cache-all-videos-for-' + channel)
          io.sockets.emit('new_video', data)
          client.say(channel, `@${username} видео добавлено`)
        })
        .catch(error => console.error(error))
    })
    .catch(() => console.error('Video does exist'))
}

const addVideo = (channel, state, args, io) => {
  checkSettings(channel, 'songrequest').then(bool => {
    if (bool) {
      const url = args[0]
      if (!url) return

      checkSettings(channel, 'songforpoints').then(allowed => {
        if (allowed) return

        checkSettings(channel, 'songforunsub').then(setting => {
          if (setting) {
            createVideo({
              url,
              channel,
              username: state.user.username,
              price: 0
            }, io)
          } else {
            if (state.subscriber || state.mod || state.user.username === channel) {
              createVideo({
                url,
                channel,
                username: state.user.username,
                price: 0
              }, io)
            }
          }
        })
      })
    } else client.say(channel, 'Возможность заказывать видео выключена!')
  })
}

const skipVideo = (channel, io) => {
  io.sockets.emit('skip', { channel })
}

module.exports = { createVideo, addVideo, skipVideo }
