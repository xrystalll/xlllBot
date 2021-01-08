import { useContext } from 'react';
import { NavLink, Redirect, Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
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

  document.title = 'xlllBot - ' + Strings.adminPanel[state.lang]

  if (!state.admin) {
    history.push('/')
  }

  return (
    <Switch>
      <Route path={path + '/channels'} exact component={Channels} />
      <Route path={path + '/invites'} exact component={Invites} />
      <Route path={path} exact>
        <Layout title={Strings.adminPanel[state.lang]} subTitle={Strings.dashboard[state.lang]}>
          <Card>
            <div className="admin__nav">
              <NavLink to={path + '/channels'} className="admin__nav_item">{Strings.allChannels[state.lang]}</NavLink>
              <NavLink to={path + '/invites'} className="admin__nav_item">{Strings.invites[state.lang]}</NavLink>
            </div>
          </Card>
        </Layout>
      </Route>
      <Route>
        <Redirect to={path} />
      </Route>
    </Switch>
  )
}

export default Admin;
