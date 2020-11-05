import React from 'react';
import { timeFormat } from 'components/support/Utils';
import './style.css';

export const EventItem = ({ data }) => {
  return (
    <div className="event_item">
      <div className="event_time">{timeFormat(data.time)}</div>
      <div>{data.text}</div>
    </div>
  )
}
