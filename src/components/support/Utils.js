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

export const timeFormat = (timestamp) => {
  const d = new Date()
  const t = new Date(Number(timestamp))

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
    return `today at ${hour}:${min}`
  } else if (`${date}.${month}.${year}` === `${curDate - 1}.${curMonth}.${curYear}`) {
    return `yesterday at ${hour}:${min}`
  } else {
    return `${date} ${month}${thisYear} at ${hour}:${min}`
  }
}

export const getCookie = (key) => {
  const match = document.cookie.match(`(^|;) ?${key}=([^;]*)(;|$)`)
  return match ? match[2] : undefined
}

export const clearCookies = () => {
  document.cookie.split(';').map(cookie => {
    document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    return true
  })
}
