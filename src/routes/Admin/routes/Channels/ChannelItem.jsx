import { useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import './style.css';

export const ChannelItem = ({ data }) => {
  const { state } = useContext(StoreContext)

  return (
    <div className="command_form">
      <input
        className="input_text"
        type="text"
        placeholder={Strings.channel[state.lang]}
        defaultValue={data.name}
      />
      {data.bot_active
        ? <div className={'channel_bot on'}>{Strings.botActive[state.lang]}</div>
        : <div className={'channel_bot'}>{Strings.botDisabled[state.lang]}</div>
      }
    </div>
  )
}
