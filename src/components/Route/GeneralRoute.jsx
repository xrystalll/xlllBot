import { Component, Fragment } from 'react';
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
          <Fragment>
            <Header />
            <Component {...props} />
            <Footer />
          </Fragment>
        )}
      />
    )
  }
}

export default GeneralRoute;
