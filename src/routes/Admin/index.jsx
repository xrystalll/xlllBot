import React, { useContext } from 'react';
import { NavLink, Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import Layout from 'components/Layout';
import Card from 'components/Card';
import Channels from './routes/Channels';
import Invites from './routes/Invites';
import './style.css';

const Admin = () => {
  const history = useHistory()

  const { state } = useContext(StoreContext)
  const { path } = useRouteMatch()

  if (!state.admin) {
    history.push('/')
  }

  return (
    <Switch>
      <Route path={path + '/channels'} component={Channels} />
      <Route path={path + '/invites'} component={Invites} />
      <Route exact path={path}>
        <Layout title={Strings.dashboard[state.lang]} subTitle={Strings.adminPanel[state.lang]}>
          <Card>
            <div className="admin__nav">
              <NavLink to={path + '/channels'} className="admin__nav_item">{Strings.allChannels[state.lang]}</NavLink>
              <NavLink to={path + '/invites'} className="admin__nav_item">{Strings.invites[state.lang]}</NavLink>
            </div>
          </Card>
        </Layout>
      </Route>
    </Switch>
  )
}

export default Admin;
