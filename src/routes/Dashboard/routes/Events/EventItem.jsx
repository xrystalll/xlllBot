import React, { useContext } from 'react';
import { StoreContext } from 'store/Store';
import { timeFormat } from 'support/Utils';
import './style.css';

export const EventItem = ({ data }) => {
  const { state } = useContext(StoreContext)

  return (
    <div className="event_item">
      <div className="event_time">{timeFormat(data.time, state.lang)}</div>
      <div>{data.text}</div>
    </div>
  )
}
