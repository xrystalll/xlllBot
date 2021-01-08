import { useState, useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { useForm } from 'hooks/useForm';
import { toast } from 'react-toastify';

export const CommandItem = ({ data, editCommand, deleteCommand }) => {
  const { state } = useContext(StoreContext)
  const { values, handleChange } = useForm({ tag: data.tag, text: data.text, countdown: data.countdown })

  const [editAction, toggleEditAction] = useState(false)
  const [errOne, setErrOne] = useState(false)
  const [errTwo, setErrTwo] = useState(false)
  const [errThree, setErrThree] = useState(false)

  const active = editAction ? ' active' : ''
  const errorOne = errOne ? ' error' : ''
  const errorTwo = errTwo ? ' error' : ''
  const errorThree = errThree ? ' error' : ''

  const changeEditState = () => {
    toggleEditAction(!editAction)
    setErrOne(false)
    setErrTwo(false)
    setErrThree(false)
  }

  const submit = (id, e) => {
    e.preventDefault()

    const tag = values.tag.trim().replace('!', '')
    const text = values.text.trim()

    if (tag.length < 1) {
      toast.error(Strings.enterCommandTag[state.lang])
      setErrOne(true)
      setErrTwo(false)
      setErrThree(false)
    } else if (text.length < 1) {
      toast.error(Strings.enterText[state.lang])
      setErrOne(false)
      setErrTwo(true)
      setErrThree(false)
    } else if (values.countdown.length < 1) {
      toast.error(Strings.enterCountdown[state.lang])
      setErrOne(false)
      setErrTwo(false)
      setErrThree(true)
    } else {
      setErrOne(false)
      setErrTwo(false)
      setErrThree(false)

      changeEditState()
      editCommand({ id, tag, text, countdown: values.countdown * 1 })
    }
  }

  return (
    <form className="command_form" onSubmit={submit.bind(this, data._id)}>
      <div className="command_prefix">!</div>
      <input
        className={'input_text command_name' + active + errorOne}
        type="text"
        name="tag"
        onChange={handleChange}
        placeholder={Strings.command[state.lang]}
        defaultValue={data.tag}
      />
      <input
        className={'input_text' + active + errorTwo}
        type="text"
        name="text"
        onChange={handleChange}
        placeholder={Strings.text[state.lang]}
        defaultValue={data.text}
      />
      <input
        className={'input_text command_countdown' + active + errorThree}
        type="number"
        name="countdown"
        onChange={handleChange}
        placeholder={Strings.countdownSeconds[state.lang]}
        defaultValue={values.countdown}
      />
      <div className="command_actions">
        {!editAction ? (
          <div className="action_block">
            <i onClick={changeEditState} className="command_edit material-icons" title={Strings.editCommand[state.lang]}>create</i>
            <i
              onClick={deleteCommand.bind(this, data._id)}
              className="item_delete material-icons-outlined"
              title={Strings.deleteCommand[state.lang]}
            >
              delete
            </i>
          </div>
        ) : (
          <div className="action_block">
            <i
              onClick={changeEditState}
              className="item_cancel material-icons"
              title={Strings.cancelChanges[state.lang]}
            >
              close
            </i>
            <input className="btn" type="submit" value={Strings.save[state.lang]} />
          </div>
        )}
      </div>
    </form>
  )
}
