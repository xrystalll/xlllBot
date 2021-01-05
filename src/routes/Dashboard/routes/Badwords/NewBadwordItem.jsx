import React, { useState, useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { useForm } from 'hooks/useForm';
import { toast } from 'react-toastify';

export const NewBadwordItem = ({ addBadword, toggleAdd }) => {
  const { state } = useContext(StoreContext)
  const { values, handleChange } = useForm({ word: '', duration: 300 })

  const [errOne, setErrOne] = useState(false)
  const [errTwo, setErrTwo] = useState(false)

  const errorOne = errOne ? ' error' : ''
  const errorTwo = errTwo ? ' error' : ''

  const submit = (e) => {
    e.preventDefault()

    const word = values.word.trim().toLowerCase()

    if (word.length < 1) {
      toast.error(Strings.enterBadword[state.lang])
      setErrOne(true)
      setErrTwo(false)
    } else if (values.duration.length < 1) {
      toast.error(Strings.enterDuration[state.lang])
      setErrOne(false)
      setErrTwo(true)
    } else {
      addBadword({ word, duration: values.duration * 1 })
    }
  }

  return (
    <form className="command_form" onSubmit={submit.bind(this)}>
      <input
        className={'input_text active' + errorOne}
        type="text"
        name="word"
        onChange={handleChange}
        placeholder={Strings.badword[state.lang]}
      />
      <input
        className={'input_text badword_duration active' + errorTwo}
        type="number"
        name="duration"
        onChange={handleChange}
        placeholder={Strings.banDurationSeconds[state.lang]}
        defaultValue={values.duration}
      />
      <div className="channel_actions">
        <i onClick={toggleAdd} className="item_cancel material-icons" title={Strings.cancelNewBadword[state.lang]}>close</i>
        <input className="btn" type="submit" value={Strings.add[state.lang]} />
      </div>
    </form>
  )
}
