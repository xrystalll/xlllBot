import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie, clearCookies } from 'support/Utils';
import '././style.css';

const Footer = () => {
  const { state } = useContext(StoreContext)
  const isAuth = !!getCookie('login') && !!getCookie('token')

  const logout = () => {
    clearCookies()
  }

  return (
    <footer id="footer">
      <div className="content--boxed-sm">
        <div className="other_copy">xlllBot 2020 <a href={'https://github.com/xrystalll'} target="_blank" rel="noopener noreferrer">by xrystalll</a></div>

        {isAuth && (
          <ul className="footer__menu">
            <li>
              <Link to="/">{Strings.home[state.lang]}</Link>
            </li>
              <li>
                <Link to="/dashboard/commands">{Strings.commands[state.lang]}</Link>
              </li>
              <li>
                <Link to="/dashboard/badwords">{Strings.badwords[state.lang]}</Link>
              </li>
              <li>
                <Link to="/dashboard/settings">{Strings.settings[state.lang]}</Link>
              </li>
              <li>
                <Link to="/" onClick={logout}>{Strings.logOut[state.lang]}</Link>
              </li>
          </ul>
        )}
      </div>
    </footer>
  )
}

export default Footer;
