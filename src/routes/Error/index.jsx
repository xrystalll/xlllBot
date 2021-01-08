import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';

export const NotFound = () => {
  const { state } = useContext(StoreContext)
  document.title = 'xlllBot - 404 Not Found'

  return (
    <div className="content">
      <div className="authModal">
        <h2>404 Not Found</h2>
        <div className="auth_form">
          <Link to="/" className="twitch_btn signin">{Strings.goToHomePage[state.lang]}</Link>
        </div>
      </div>
    </div>
  )
}
