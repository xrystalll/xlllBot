import React from 'react';
import '././style.css';

const Fab = ({ icon, title, onClick, className }) => {
  const cssClass = !!className ? ' ' + className : ''

  return (
    <div onClick={onClick} className={'fab' + cssClass} title={title}>
      <i className="material-icons">{icon}</i>
    </div>
  )
}

export default Fab;
