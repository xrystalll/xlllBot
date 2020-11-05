import React from 'react';
import { toHHMMSS, counter } from 'components/support/Utils';
import './style.css';

export const VideoItem = ({ index, playIndex, data, chooseVideo, deleteVideo }) => {
  const selected = playIndex === index ? ' selected' : ''

  return (
    <li
      className={'video_item' + selected}
      onClick={chooseVideo.bind(this, { id: data.yid, index })}
      title={`Video requested: ${data.from.username}\nPrice: ${data.from.price}`}
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
          title="Remove video from playlist"
        >
          <i className="material-icons">delete</i>
        </div>
      </div>
    </li>
  )
}
