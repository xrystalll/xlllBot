import React from 'react';
import '././style.css';

const Switch = ({ checked, onChange, children }) => {
  return (
    <label className="switch">
      <input type="checkbox" onChange={onChange.bind(this)} checked={checked} />
      <span>
        {children}
      </span>
    </label>
  )
}

export default Switch;
