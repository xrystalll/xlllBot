import React, { useState } from 'react';
import { useForm } from 'hooks/useForm';
import { toast } from 'react-toastify';

export const NewBadwordItem = ({ addBadword, toggleAdd }) => {
  const { values, handleChange } = useForm({ word: '', duration: 300 })

  const [errOne, setErrOne] = useState(false)
  const [errTwo, setErrTwo] = useState(false)

  const errorOne = errOne ? ' error' : ''
  const errorTwo = errTwo ? ' error' : ''

  const submit = (e) => {
    e.preventDefault()

    const word = values.word.trim().toLowerCase()

    if (word.length < 1) {
      toast.error('Enter word')
      setErrOne(true)
      setErrTwo(false)
    } else if (values.duration.length < 1) {
      toast.error('Enter duration')
      setErrOne(false)
      setErrTwo(true)
    } else {
      addBadword({ word, duration: values.duration * 1 })
    }
  }

  return (
    <form className="command_form" onSubmit={submit.bind(this)}>
      <input
        className={'input_text badword_name active' + errorOne}
        type="text"
        name="word"
        onChange={handleChange}
        placeholder="Enter badword"
      />
      <input
        className={'input_text badword_duration active' + errorTwo}
        type="number"
        name="duration"
        onChange={handleChange}
        placeholder="Enter ban duration (seconds)"
        defaultValue={values.duration}
      />
      <div className="channel_actions">
        <i onClick={toggleAdd} className="item_cancel badword_new_cancel material-icons" title="Cancel new badword">close</i>
        <input className="btn" type="submit" value="Add" />
      </div>
    </form>
  )
}
