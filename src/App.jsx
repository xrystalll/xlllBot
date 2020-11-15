import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { getCookie } from 'components/support/Utils';
import { socket } from 'instance/Socket';
import { Store, StoreContext } from 'store/Store';
import CustomScrollbar from 'components/support/CustomScrollbar';
import PrivateRoute from 'components/support/PrivateRoute';
import GeneralRoute from 'components/support/GeneralRoute';
import SysBar from 'components/partials/SysBar';
import Home from 'components/home';
import Channel from 'components/channel';
import Commands from 'components/commands';
import Badwords from 'components/badwords';
import Videos from 'components/videos';
import Events from 'components/events';
import Settings from 'components/settings';
import AllCommands from 'components/allcommands';
import { Auth } from 'components/auth';
import { AuthError } from 'components/auth/error';
import { NotFound } from 'components/error';
import { ToastContainer, toast } from 'react-toastify';
import YouTubePlayer from 'components/videos/YoutubePlayer';

class App extends Component {
  static contextType = StoreContext;
  constructor() {
    super();
    this.state = {
      isElectron: navigator.userAgent.toLowerCase().indexOf('electron') > -1 || false
    }
  }

  componentDidMount() {
    this.subscribeToEvents()
  }

  subscribeToEvents() {
    socket.on('new_video', (data) => {
      if (data.channel !== getCookie('login')) return

      this.context.dispatch({ type: 'ADD_VIDEO', payload: data })
      this.context.dispatch({ type: 'SET_ERROR', payload: false })
    })
    socket.on('deteted', (data) => {
      this.context.dispatch({ type: 'REMOVE_VIDEO', payload: data })

      if (this.context.state.response.filter(item => item._id !== data.id).length === 0) {
        this.context.dispatch({ type: 'SET_ERROR', payload: true })
      }
    })
    socket.on('alert', (data) => {
      toast.error(data.message)
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isElectron
          ? document.querySelector('#root') ? document.querySelector('#root').classList.add('app') : null
          : document.querySelector('#root') ? document.querySelector('#root').classList.remove('app') : null
        }
        {this.state.isElectron && <SysBar />}

        <CustomScrollbar className="view">
          <Router>
            <Switch>
              <Route path="/" exact component={Home} />
              <PrivateRoute path="/dashboard/channel" component={Channel} />
              <PrivateRoute path="/dashboard/commands" component={Commands} />
              <PrivateRoute path="/dashboard/badwords" component={Badwords} />
              <PrivateRoute path="/dashboard/videos" component={Videos} />
              <PrivateRoute path="/dashboard/events" component={Events} />
              <PrivateRoute path="/dashboard/settings" component={Settings} />
              <GeneralRoute path="/commands" component={AllCommands} />
              <Route path="/auth" exact component={Auth} />
              <Route path="/auth/error" component={AuthError} />
              <Route component={NotFound} status={404} />
            </Switch>
          </Router>

          <ToastContainer position="bottom-right" autoClose={2000} pauseOnFocusLoss={false} />
        </CustomScrollbar>

        {this.context.state.mini && <YouTubePlayer />}
      </React.Fragment>
    )
  }
}

const Root = () => {
  return (
    <Store>
      <App />
    </Store>
  )
}

export default Root;
