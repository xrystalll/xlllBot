import './style.css';

const Switch = ({ checked, onChange, children }) => {
  return (
    <label className="switch">
      <input type="checkbox" onChange={onChange} checked={checked} />
      <span>
        {children}
      </span>
    </label>
  )
}

export default Switch;
