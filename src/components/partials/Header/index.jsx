import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getCookie } from 'components/support/Utils';
import CustomScrollbar from 'components/support/CustomScrollbar';
import '././style.css';

class Header extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.isAuth = !!getCookie('login') && !!getCookie('token')
    this.state = {
      showMenu: false,
      login: getCookie('login'),
      logo: decodeURIComponent(getCookie('logo'))
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    document.addEventListener('click', this.handleOutsideClick.bind(this), false)
  }

  componentWillUnmount() {
    this._isMounted = false
    document.removeEventListener('click', this.handleOutsideClick.bind(this), false)
  }

  toggleMenu() {
    if (!this._isMounted) return

    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  closeMenu() {
    if (!this._isMounted) return

    this.setState({
      showMenu: false
    })
  }

  handleOutsideClick(e) {
    if (!e.target.closest('.open')) {
      this.closeMenu()
    }
  }

  render() {
    const { login, logo, showMenu } = this.state
    const menuVis = showMenu ? 'open' : ''

    return (
      <>
        <header id="header" className={menuVis}>
          <div className="logo">
            <i onClick={this.toggleMenu} className="logo__trigger material-icons">menu</i>
            <h1>xlllBot</h1>
          </div>

          {this.isAuth && (
            <ul className="top-menu">
              <li className="top-menu__profile">
                <Link to="/dashboard/channel">
                  <span className="userName">{login || ''}</span>
                  <div className="userPhoto" style={{ 'backgroundImage': `url(${logo || ''})` }}></div>
                </Link>
              </li>
            </ul>
          )}
        </header>

        <nav id="navigation" className={menuVis}>
          <CustomScrollbar className="navigation__menu">
            <ul>
              <li>
                <NavLink exact to="/" onClick={this.closeMenu}>
                  <i className="nav-ic">home</i>
                  Home
                </NavLink>
              </li>
              {this.isAuth && (
                <React.Fragment>
                  <li>
                    <NavLink to="/dashboard/channel" onClick={this.closeMenu}>
                      <i className="nav-ic">person</i>
                      Channel
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/commands" onClick={this.closeMenu}>
                      <i className="material-icons">list</i>
                      Commands
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/badwords" onClick={this.closeMenu}>
                      <i className="nav-ic">voice_over_off</i>
                      Badwords
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/videos" onClick={this.closeMenu}>
                      <i className="material-icons">playlist_play</i>
                      Stream Dj
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/events" onClick={this.closeMenu}>
                      <i className="material-icons">playlist_add_check</i>
                      Events
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/settings" onClick={this.closeMenu}>
                      <i className="nav-ic">settings</i>
                      Settings
                    </NavLink>
                  </li>
                </React.Fragment>
              )}
              <li>
                <NavLink to="/commands" onClick={this.closeMenu}>
                  <i className="material-icons">list</i>
                  All commands
                </NavLink>
              </li>
            </ul>
          </CustomScrollbar>
        </nav>
      </>
    )
  }
}

export default Header;
