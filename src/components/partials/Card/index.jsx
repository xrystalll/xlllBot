import React from 'react';
import '././style.css';

const Card = ({ title, action, className, children }) => {
  const cssClass = !!className ? ' ' + className : ''

  return (
    <div className="card">
      <div className="card__body">
        <div className="card__sub">
          {!!title && <h4>{title}</h4>}
          {!!action && action}
          <div className={'content_inner' + cssClass}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card;
