import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getCookie } from 'components/support/Utils';
import { toast } from 'react-toastify';

class PrivateRoute extends Component {
  constructor() {
    super();
    this.isAuth = !!getCookie('login') && !!getCookie('token')
  }

  componentDidMount() {
    if (!this.isAuth) toast.error('You are not authorized')
  }

  render() {
    const { component: Component, ...rest } = this.props

    return (
      <Route
        {...rest}
        render = {props =>
          this.isAuth ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          )
        }
      />
    )
  }
}

export default PrivateRoute;
