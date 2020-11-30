const path = require('path')
const Strings = require(path.join(__dirname, '..', '..', 'config', 'strings.json'))
const { declOfNum } = require(path.join(__dirname, '..', 'Utils'))
const client = require(path.join(__dirname, '..', 'client'))

const timeOutUser = (channel, args) => {
  const fullTargetUser = args[0]
  const timeOutDuration = args[1] || 300

  if (!fullTargetUser) return

  const targetUser = fullTargetUser.replace('@', '')

  if (targetUser === channel) return

  client.timeout(channel, targetUser, timeOutDuration)
    .then(() => client.say(channel, `@${targetUser} ${Strings.youAreInMuteOn} ${timeOutDuration} ${declOfNum(timeOutDuration, [Strings.second, Strings.seconds, Strings.manySeconds])} ${Strings.lul}`))
    .catch(err => console.error(err))
}

const banUser = (channel, args) => {
  const fullTargetUser = args[0]
  const reason = args[1] || 'Hateful conduct'

  if (!fullTargetUser) return

  const targetUser = fullTargetUser.replace('@', '')

  if (targetUser === channel) return

  client.ban(channel, targetUser, reason).catch(err => console.error(err))
}

const unbanUser = (channel, args) => {
  const fullTargetUser = args[0]

  if (!fullTargetUser) return

  const targetUser = fullTargetUser.replace('@', '')

  if (targetUser === channel) return

  client.unban(channel, targetUser)
    .then(() => client.say(channel, `@${targetUser} ${Strings.youWereUnbannedButImWatchingYou} ${Strings.bCWarrior}`))
    .catch(err => console.error(err))
}

module.exports = { timeOutUser, banUser, unbanUser }
