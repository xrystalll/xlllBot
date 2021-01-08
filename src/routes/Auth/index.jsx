import { useEffect, useContext } from 'react';
import { apiEndPoint } from 'config';
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

export const AuthError = () => {
  const { state } = useContext(StoreContext)
  document.title = 'xlllBot - ' + Strings.logIn[state.lang]

  return (
    <div className="content">
      <div className="authModal">
        <h2 className="error_title">{Strings.failedToLogin[state.lang]}</h2>
        <div className="auth_text">{Strings.tryAgain[state.lang]}</div>
        <div className="auth_form">
            <a href={apiEndPoint + '/auth/twitch'} className="twitch_btn signin">
              <svg className="tw-glitch-logo__svg" overflow="visible" width="40px" height="40px" version="1.1" viewBox="0 0 40 40" x="0px" y="0px">
                <polygon className="tw-glitch-logo__body" points="13 8 8 13 8 31 14 31 14 36 19 31 23 31 32 22 32 8" />
                <polygon className="tw-glitch-logo__face" points="26 25 30 21 30 10 14 10 14 25 18 25 18 29 22 25" transform="translate(0 0)" />
                <path className="tw-glitch-logo__eyes" d="M20,14 L22,14 L22,20 L20,20 L20,14 Z M27,14 L27,20 L25,20 L25,14 L27,14 Z" transform="translate(0 0)" />
              </svg>
              {Strings.signInViaTwitch[state.lang]}
            </a>
        </div>
      </div>
    </div>
  )
}
