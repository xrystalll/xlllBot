export const toHHMMSS = (sec = 0) => {
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec - (hours * 3600)) / 60)
  const seconds = sec - (hours * 3600) - (minutes * 60)

  return (
    (hours || '') + (hours > 0 ? ':' : '') +
    (minutes < 10 && hours > 0 ? '0' : '') + minutes + ':' +
    (seconds < 10 ? '0' : '') + seconds
  )
}

export const counter = (count = 0) => {
  if (count < 1e3) return count
  if (count >= 1e3 && count < 1e6) return `${(count / 1e3).toFixed(1)}K`
  if (count >= 1e6 && count < 1e9) return `${(count / 1e6).toFixed(1)}M`
  if (count >= 1e9 && count < 1e12) return `${(count / 1e9).toFixed(1)}B`
}

export const timeFormat = (timestamp, lang = 'en') => {
  const d = new Date()
  const t = new Date(Number(timestamp))

  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthsRu = ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Отк', 'Ноя', 'Дек']
  const months = lang === 'ru' ? monthsRu : monthsEn

  const today = lang === 'ru' ? 'сегодня в' : 'today at'
  const yesterday = lang === 'ru' ? 'вчера в' : 'yesterday at'
  const at = lang === 'ru' ? 'в' : 'at'

  const curYear = d.getFullYear()
  const curMonth = months[d.getMonth()]
  const curDate = d.getDate()

  const year = t.getFullYear()
  const month = months[t.getMonth()]
  const date = t.getDate()
  const hour = t.getHours()
  const min = t.getMinutes() < 10 ? `0${t.getMinutes()}` : t.getMinutes()

  let thisYear
  year !== curYear ? thisYear = ` ${year}` : thisYear = ''

  if (`${date}.${month}.${year}` === `${curDate}.${curMonth}.${curYear}`) {
    return `${today} ${hour}:${min}`
  } else if (`${date}.${month}.${year}` === `${curDate - 1}.${curMonth}.${curYear}`) {
    return `${yesterday} ${hour}:${min}`
  } else {
    return `${date} ${month}${thisYear} ${at} ${hour}:${min}`
  }
}

export const getCookie = (key) => {
  const match = document.cookie.match(`(^|;) ?${key}=([^;]*)(;|$)`)
  return match ? match[2] : undefined
}

export const clearCookies = () => {
  localStorage.removeItem('admin')
  document.cookie.split(';').map(cookie => {
    document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    return true
  })
}
