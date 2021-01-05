import React from 'react';
import { Redirect, Switch, Route, useRouteMatch } from 'react-router-dom';
import Channel from './routes/Channel';
import Commands from './routes/Commands';
import Badwords from './routes/Badwords';
import Videos from './routes/Videos';
import Events from './routes/Events';
import Settings from './routes/Settings';

const Dashboard = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={path + '/channel'} component={Channel} />
      <Route path={path + '/commands'} component={Commands} />
      <Route path={path + '/badwords'} component={Badwords} />
      <Route path={path + '/videos'} component={Videos} />
      <Route path={path + '/events'} component={Events} />
      <Route path={path + '/settings'} component={Settings} />
      <Route>
        <Redirect to={{ pathname: path + '/channel' }} />
      </Route>
    </Switch>
  )
}

export default Dashboard;
