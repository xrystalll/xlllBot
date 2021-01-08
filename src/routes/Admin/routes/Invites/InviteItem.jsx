import { useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';

export const InviteItem = ({ data, deleteInvite }) => {
  const { state } = useContext(StoreContext)

  return (
    <div className="command_form">
      <input
        className="input_text"
        type="text"
        placeholder={Strings.channel[state.lang]}
        defaultValue={data.channel}
      />
      <div className="channel_actions">
        <i
          onClick={deleteInvite.bind(this, data._id)}
          className="item_delete material-icons-outlined"
          title={Strings.deleteInvite[state.lang]}
        >
          delete
        </i>
      </div>
    </div>
  )
}
