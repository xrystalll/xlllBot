import React, { useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';

export const BadwordItem = ({ data, deleteBadword }) => {
  const { state } = useContext(StoreContext)

  return (
    <div className="command_form">
      <input
        className="input_text badword_name"
        type="text"
        placeholder={Strings.badword[state.lang]}
        defaultValue={data.word}
      />
      <input
        className="input_text badword_duration"
        type="text"
        placeholder={Strings.banDurationSeconds[state.lang]}
        defaultValue={data.duration}
      />
      <div className="channel_actions">
        <i
          onClick={deleteBadword.bind(this, data._id)}
          className="item_delete badword_delete material-icons-outlined"
          title={Strings.deleteDadword[state.lang]}
        >
          delete
        </i>
      </div>
    </div>
  )
}
