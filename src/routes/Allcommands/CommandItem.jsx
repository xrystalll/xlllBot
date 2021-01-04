import React, { useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';

export const CommandItem = ({ data, type }) => {
  const { state } = useContext(StoreContext)

  return (
    type === 'full' ? (
      <div className="command_form">
        <input className="input_text command_name full" type="text" placeholder={Strings.command[state.lang]} defaultValue={data.name} />
        <input className="input_text" type="text" placeholder={Strings.description[state.lang]} defaultValue={data.text} />
      </div>
    ) : (
      <div className="command_form">
        <input className="input_text command_name" type="text" placeholder={Strings.shortName[state.lang]} defaultValue={data.short} />
        <input className="input_text" type="text" placeholder={Strings.streamCategory[state.lang]} defaultValue={data.game} />
      </div>
    )
  )
}
