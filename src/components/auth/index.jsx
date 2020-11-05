import React, { useEffect } from 'react';

export const Auth = () => {

  useEffect(() => {
    document.title = 'xlllBot - Log in'
    setTimeout(() => window.close(), 2000)
  })

  return (
    <div className="content">
      <div className="authModal">
        <h2 className="success_title">Successfully logged in</h2>
        <div className="auth_text">You can now close this window.</div>
      </div>
    </div>
  )
}
