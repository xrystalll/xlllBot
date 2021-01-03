import React, { useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';

export const ChannelItem = ({ data }) => {
  const { state } = useContext(StoreContext)

  return (
    <div className="command_form">
      <input
        className="input_text badword_name"
        type="text"
        placeholder={Strings.channel[state.lang]}
        defaultValue={data.name}
      />
    </div>
  )
}
