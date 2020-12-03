import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { apiEndPoint } from 'config';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie } from 'support/Utils';
import { socket } from 'support/Socket';
import './style.css';

class Home extends Component {
  static contextType = StoreContext;
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      isAuth: false,
      authClicked: false
    }
  }

  componentDidMount() {
    document.title = 'xlllBot'
    this._isMounted = true
    if (getCookie('login') && getCookie('token')) {
      this.setState({ isAuth: true })
      this.props.history.push('/dashboard/channel')
    }
    socket.on('auth', (data) => {
      if (!this.state.authClicked) return

      if (!data.error) {
        if (!this._isMounted) return

        data.auth && this.setState({ isAuth: true, authClicked: false })
        this.timeout = setTimeout(() => this.props.history.push('/dashboard/channel'), 1500)
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
    clearTimeout(this.timeout)
  }

  openAuth(url) {
    if (!this._isMounted) return

    this.setState({ authClicked: true })
    window.open(url, 'Sign in via Twitch', 'height=340,width=420')
  }

  render() {
    return (
      <main className="landing">
        <div className="bg" />
        <div className="container">
          <div className="landing_content">
            <h1 className="main_head">xlllBot</h1>
            <div className="main_sub">{Strings.chatBotForTwitch[this.context.state.lang]}</div>
            <div className="auth_block_main">
              {this.state.isAuth ? (
                <Link className="twitch_btn_main" to="/dashboard/channel">{Strings.openDashboard[this.context.state.lang]}</Link>
              ) : (
                <div onClick={this.openAuth.bind(this, apiEndPoint + '/auth/twitch')} className="twitch_btn_main">
                  <svg className="tw-glitch-logo__svg" overflow="visible" width="40px" height="40px" version="1.1" viewBox="0 0 40 40" x="0px" y="0px">
                    <polygon className="tw-glitch-logo__body" points="13 8 8 13 8 31 14 31 14 36 19 31 23 31 32 22 32 8" />
                    <polygon className="tw-glitch-logo__face" points="26 25 30 21 30 10 14 10 14 25 18 25 18 29 22 25" transform="translate(0 0)" />
                    <path className="tw-glitch-logo__eyes" d="M20,14 L22,14 L22,20 L20,20 L20,14 Z M27,14 L27,20 L25,20 L25,14 L27,14 Z" transform="translate(0 0)" />
                  </svg>
                  {Strings.signInViaTwitch[this.context.state.lang]}
                </div>
              )}
            </div>
          </div>
          <div className="main_copy">
            <a href={'https://github.com/xrystalll'} target="_blank" rel="noopener noreferrer">by xrystalll</a>
          </div>
        </div>
      </main>
    )
  }
}

export default withRouter(Home);
