import React, { useState, useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { useForm } from 'hooks/useForm';
import { toast } from 'react-toastify';

export const NewInviteItem = ({ addInvite, toggleAdd }) => {
  const { state } = useContext(StoreContext)
  const { values, handleChange } = useForm({ channel: '' })

  const [err, setErr] = useState(false)

  const error = err ? ' error' : ''

  const submit = (e) => {
    e.preventDefault()

    const channel = values.channel.trim().toLowerCase()

    if (channel.length < 1) {
      toast.error(Strings.enterChannelName[state.lang])
      setErr(true)
    } else {
      addInvite({ channel })
    }
  }

  return (
    <form className="command_form" onSubmit={submit.bind(this)}>
      <input
        className={'input_text active' + error}
        type="text"
        name="channel"
        onChange={handleChange}
        placeholder={Strings.channel[state.lang]}
      />
      <div className="channel_actions">
        <i onClick={toggleAdd} className="item_cancel material-icons" title={Strings.cancelNewInvite[state.lang]}>close</i>
        <input className="btn" type="submit" value={Strings.add[state.lang]} />
      </div>
    </form>
  )
}
