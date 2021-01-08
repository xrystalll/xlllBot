import { useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { toHHMMSS, counter } from 'support/Utils';
import './style.css';

export const VideoItem = ({ index, playIndex, data, chooseVideo, deleteVideo }) => {
  const { state } = useContext(StoreContext)
  const selected = playIndex === index ? ' selected' : ''

  return (
    <li
      className={'video_item' + selected}
      onClick={chooseVideo.bind(this, { id: data.yid, index })}
      title={`${Strings.videoRequested[state.lang]}: ${data.from.username}\n${Strings.price[state.lang]}: ${data.from.price}`}
    >
      <div className="choose_vid">
        <span className="vid_thumb" style={{ 'backgroundImage': `url(${data.thumb})` }}>
          <div className="vid_duration">{toHHMMSS(data.duration)}</div>
        </span>
        <div className="vid_info">
          <div className="desc" title={data.title}>{data.title}</div>
          <div className="owner" title={data.owner}>{data.owner}</div>
          <div className="views">{counter(data.views)} views</div>
        </div>
        <div
          className="remove_vid"
          onClick={deleteVideo.bind(this, data._id)}
          title={Strings.removeVideoFromPlaylist[state.lang]}
        >
          <i className="material-icons-outlined">delete</i>
        </div>
      </div>
    </li>
  )
}
