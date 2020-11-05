import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class GeneralRoute extends Component {
  render() {
    const { component: Component, ...rest } = this.props

    return (
      <Route
        {...rest}
        render = {props => (
          <Component {...props} />
        )}
      />
    )
  }
}

export default GeneralRoute;
