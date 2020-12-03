import React, { useEffect, useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';

export const Auth = () => {
  const { state } = useContext(StoreContext)

  useEffect(() => {
    document.title = 'xlllBot - ' + Strings.logIn[state.lang]
    setTimeout(() => window.close(), 1500)
  })

  return (
    <div className="content">
      <div className="authModal">
        <h2 className="success_title">{Strings.successfullyLoggedIn[state.lang]}</h2>
        <div className="auth_text">{Strings.youCanNowCloseThisWindow[state.lang]}</div>
      </div>
    </div>
  )
}
