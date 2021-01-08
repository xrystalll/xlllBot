import { Component, Fragment } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie } from 'support/Utils';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { toast } from 'react-toastify';

class PrivateRoute extends Component {
  static contextType = StoreContext;
  constructor() {
    super();
    this.isAuth = !!getCookie('login') && !!getCookie('token')
  }

  componentDidMount() {
    if (!this.isAuth) toast.error(Strings.youAreNotAuthorized[this.context.state.lang])
  }

  render() {
    const { component: Component, ...rest } = this.props

    return (
      <Route
        {...rest}
        render = {props =>
          this.isAuth ? (
            <Fragment>
              <Header />
              <Component {...props} />
              <Footer />
            </Fragment>
          ) : (
            <Redirect to="/" />
          )
        }
      />
    )
  }
}

export default PrivateRoute;
