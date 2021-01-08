import { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie } from 'support/Utils';
import Dropdown from 'components/Dropdown';
import CustomScrollbar from 'components/CustomScrollbar';
import './style.css';

class Header extends Component {
  static contextType = StoreContext;
  _isMounted = false;
  constructor() {
    super();
    this.isAuth = !!getCookie('login') && !!getCookie('token')
    this.state = {
      showMenu: false,
      login: getCookie('login'),
      logo: getCookie('logo')
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    window.addEventListener('click', this.handleOutsideClick.bind(this))
  }

  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('click', this.handleOutsideClick.bind(this))
  }

  toggleMenu() {
    if (!this._isMounted) return

    this.setState({ showMenu: !this.state.showMenu })
  }

  closeMenu() {
    if (!this._isMounted) return

    this.setState({ showMenu: false })
  }

  handleOutsideClick(e) {
    if (!e.target.closest('.open') || e.target.closest('.top-menu')) {
      this.closeMenu()
    }
  }

  render() {
    const { login, logo, showMenu } = this.state
    const menuVis = showMenu ? 'open' : ''

    return (
      <Fragment>
        <header id="header" className={menuVis}>
          <div className="logo">
            <i onClick={this.toggleMenu} className="logo__trigger material-icons">menu</i>
            <h1>xlllBot</h1>
          </div>

          <Dropdown isAuth={this.isAuth} login={login} logo={logo} />
        </header>

        <nav id="navigation" className={menuVis}>
          <CustomScrollbar className="navigation__menu">
            <ul>
              <li>
                <NavLink exact to="/" onClick={this.closeMenu}>
                  <i className="nav-ic">home</i>
                  {Strings.home[this.context.state.lang]}
                </NavLink>
              </li>
              {this.isAuth && (
                <Fragment>
                  <li>
                    <NavLink to="/dashboard/channel" onClick={this.closeMenu}>
                      <i className="nav-ic">person</i>
                      {Strings.channel[this.context.state.lang]}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/commands" onClick={this.closeMenu}>
                      <i className="material-icons">list</i>
                      {Strings.commands[this.context.state.lang]}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/badwords" onClick={this.closeMenu}>
                      <i className="nav-ic">voice_over_off</i>
                      {Strings.badwords[this.context.state.lang]}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/videos" onClick={this.closeMenu}>
                      <i className="material-icons">playlist_play</i>
                      {Strings.streamDj[this.context.state.lang]}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/events" onClick={this.closeMenu}>
                      <i className="material-icons">playlist_add_check</i>
                      {Strings.events[this.context.state.lang]}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/settings" onClick={this.closeMenu}>
                      <i className="nav-ic">settings</i>
                      {Strings.settings[this.context.state.lang]}
                    </NavLink>
                  </li>
                  {!!this.context.state.admin && (
                    <li>
                      <NavLink to="/admin" onClick={this.closeMenu}>
                        <i className="nav-ic">admin_panel_settings</i>
                        {Strings.adminPanel[this.context.state.lang]}
                      </NavLink>
                    </li>
                  )}
                </Fragment>
              )}
              <li>
                <NavLink to="/commands" onClick={this.closeMenu}>
                  <i className="material-icons">list</i>
                  {Strings.allCommands[this.context.state.lang]}
                </NavLink>
              </li>
            </ul>
          </CustomScrollbar>
        </nav>
      </Fragment>
    )
  }
}

export default Header;
