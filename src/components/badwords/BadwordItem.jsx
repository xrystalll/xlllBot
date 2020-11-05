import React from 'react';

export const BadwordItem = ({ data, deleteBadword }) => {
  return (
    <div className="command_form">
      <input className="input_text badword_name" type="text" placeholder="Badword" defaultValue={data.word} />
      <input className="input_text badword_duration" type="text" placeholder="Ban duration (seconds)" defaultValue={data.duration} />
      <div className="channel_actions">
        <i onClick={deleteBadword.bind(this, data._id)} className="item_delete badword_delete material-icons" title="Delete badword">delete</i>
      </div>
    </div>
  )
}
