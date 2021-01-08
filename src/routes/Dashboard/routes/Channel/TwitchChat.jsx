export const TwitchChat = ({ channel }) => {
  return (
    <iframe
      title="TwitchChat"
      src={`https://www.twitch.tv/embed/${channel}/chat?darkpopout&parent=` + document.location.hostname}
      frameBorder="0"
      scrolling="no"
      width="284"
      height="384" />
  )
}
