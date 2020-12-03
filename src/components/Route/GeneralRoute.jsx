import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';

class GeneralRoute extends Component {
  render() {
    const { component: Component, ...rest } = this.props

    return (
      <Route
        {...rest}
        render = {props => (
          <React.Fragment>
            <Header />
            <Component {...props} />
            <Footer />
          </React.Fragment>
        )}
      />
    )
  }
}

export default GeneralRoute;
