import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CustomScrollbar from 'components/support/CustomScrollbar';
import PrivateRoute from 'components/support/PrivateRoute';
import GeneralRoute from 'components/support/GeneralRoute';
import { socket } from 'instance/Socket';
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

class App extends Component {
  constructor() {
    super();
    this.state = {
      isElectron: navigator.userAgent.toLowerCase().indexOf('electron') > -1 || false
    }
  }

  componentDidMount() {
    socket.on('alert', (data) => {
      toast.error(data.message)
    })
  }

  render() {
    return (
      <>
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
      </>
    )
  }
}

export default App;
