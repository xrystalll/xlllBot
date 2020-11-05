import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  document.title = 'xlllBot - 404 Not Found'

  return (
    <div className="content">
      <div className="authModal">
        <h2>404 Not Found</h2>
        <div className="auth_form">
          <Link to="/" className="twitch_btn signin">Go to home page</Link>
        </div>
      </div>
    </div>
  )
}
