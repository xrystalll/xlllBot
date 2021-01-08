import { useState, useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { useForm } from 'hooks/useForm';
import { toast } from 'react-toastify';

export const NewCommandItem = ({ addCommand, toggleAdd }) => {
  const { state } = useContext(StoreContext)
  const { values, handleChange } = useForm({ tag: '', text: '', countdown: 0 })

  const [errOne, setErrOne] = useState(false)
  const [errTwo, setErrTwo] = useState(false)
  const [errThree, setErrThree] = useState(false)

  const errorOne = errOne ? ' error' : ''
  const errorTwo = errTwo ? ' error' : ''
  const errorThree = errThree ? ' error' : ''

  const submit = (e) => {
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
      addCommand({ tag, text, countdown: values.countdown * 1 })
    }
  }

  return (
    <form className="command_form" onSubmit={submit.bind(this)}>
      <div className="command_prefix">!</div>
      <input
        className={'input_text command_name active' + errorOne}
        type="text"
        name="tag"
        onChange={handleChange}
        placeholder={Strings.command[state.lang]}
      />
      <input
        className={'input_text active' + errorTwo}
        type="text"
        name="text"
        onChange={handleChange}
        placeholder={Strings.text[state.lang]}
      />
      <input
        className={'input_text command_countdown active' + errorThree}
        type="number"
        name="countdown"
        onChange={handleChange}
        placeholder={Strings.countdownSeconds[state.lang]}
        defaultValue={values.countdown}
      />
      <div className="command_actions">
        <i onClick={toggleAdd} className="item_cancel material-icons" title={Strings.cancelNewCommand[state.lang]}>close</i>
        <input className="btn" type="submit" value={Strings.add[state.lang]} />
      </div>
    </form>
  )
}
