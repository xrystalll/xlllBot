import { useState } from 'react';
import { useForm } from 'hooks/useForm';
import { toast } from 'react-toastify';
import './style.css';

export const SettingItem = ({ data, changeSetting }) => {
  const { values, handleChange } = useForm({ value: data.value })

  const [err, setErr] = useState(false)

  const error = err ? ' error' : ''

  const submit = (name, e) => {
    e.preventDefault()

    if (values.value.length < 1) {
      toast.error('Enter price value')
      setErr(true)
    } else {
      setErr(false)

      changeSetting({ name, state: false, value: values.value * 1 })
    }
  }

  const click = (name, e) => {
    const state = !e.currentTarget.parentNode.children[0].checked

    changeSetting({ name, state })
  }

  return (
    data.value === null || data.value === undefined ? (
      <div className="md-checkbox">
        <input id={data.name} type="checkbox" defaultChecked={data.state} />
        <label htmlFor={data.name} onClick={click.bind(this, data.name)} className="setting_item">
          <span>{data.description}</span>
        </label>
      </div>
    ) : (
      <form className="md-checkbox" onSubmit={submit.bind(this, data.name)}>
        <div className="setting_description">{data.description}</div>
        <div className="set_setting_value">
          <input
            className={'input_text active' + error}
            type="number"
            name="value"
            onChange={handleChange}
            placeholder="Enter price"
            defaultValue={data.value}
          />
          <input className="btn" type="submit" value="Save" />
        </div>
      </form>
    )
  )
}
