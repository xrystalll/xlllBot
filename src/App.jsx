import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { getCookie } from 'support/Utils';
import { socket } from 'support/Socket';
import Store, { StoreContext } from 'store/Store';
import CustomScrollbar from 'components/CustomScrollbar';
import PrivateRoute from 'components/Route/PrivateRoute';
import GeneralRoute from 'components/Route/GeneralRoute';
import SysBar from 'components/SysBar';
import Home from 'routes/Home';
import Channel from 'routes/Channel';
import Commands from 'routes/Commands';
import Badwords from 'routes/Badwords';
import Videos from 'routes/Videos';
import YouTubePlayer from 'routes/Videos/YoutubePlayer';
import Events from 'routes/Events';
import Settings from 'routes/Settings';
import Admin from 'routes/Admin';
import AllCommands from 'routes/Allcommands';
import { Auth } from 'routes/Auth';
import { AuthError } from 'routes/Auth/Error';
import { NotFound } from 'routes/Error';
import { ToastContainer, toast } from 'react-toastify';

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
              <PrivateRoute path="/admin" component={Admin} />
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
