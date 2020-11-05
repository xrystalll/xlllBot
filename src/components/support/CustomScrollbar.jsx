import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class CustomScrollbar extends Component {
  render() {
    return (
      <Scrollbars
        autoHide
        renderTrackHorizontal={props => <div {...props} className="track-horizontal" />}
        renderTrackVertical={props => <div {...props} className="track-vertical" />}
        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" />}
        renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
        renderView={props => <div {...props} className={this.props.className} />}
      >
        {this.props.children}
      </Scrollbars>
    )
  }
}

export default CustomScrollbar;
