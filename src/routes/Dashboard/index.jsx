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
      <Route path={path + '/channel'} exact component={Channel} />
      <Route path={path + '/commands'} exact component={Commands} />
      <Route path={path + '/badwords'} exact component={Badwords} />
      <Route path={path + '/videos'} exact component={Videos} />
      <Route path={path + '/events'} exact component={Events} />
      <Route path={path + '/settings'} exact component={Settings} />
      <Route>
        <Redirect to={path + '/channel'} />
      </Route>
    </Switch>
  )
}

export default Dashboard;
