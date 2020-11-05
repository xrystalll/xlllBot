import React from 'react';

export const CommandItem = ({ data, type }) => {
  return (
    type === 'full' ? (
      <div className="command_form">
        <input className="input_text command_name full" type="text" placeholder="Command" defaultValue={data.name} />
        <input className="input_text command_text" type="text" placeholder="Description" defaultValue={data.text} />
      </div>
    ) : (
      <div className="command_form">
        <input className="input_text command_name" type="text" placeholder="Short name" defaultValue={data.short} />
        <input className="input_text command_text" type="text" placeholder="Stream category" defaultValue={data.game} />
      </div>
    )
  )
}
