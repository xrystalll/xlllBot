import React, { useState } from 'react';

const SysBar = ({ title = '' }) => {
  const [full, setFull] = useState(false)

  const minimize = () => {
    const remote = (window.require) ? window.require('electron').remote : null
    if (!remote) return

    const win = remote.getCurrentWindow()
    win.minimize()
  }

  const fullToggle = () => {
    const remote = (window.require) ? window.require('electron').remote : null
    if (!remote) return

    const win = remote.getCurrentWindow()
    if (win.isMaximized()) {
      setFull(!full)
      win.unmaximize()
    } else {
      setFull(!full)
      win.maximize()
    }
  }

  const close = () => {
    const remote = (window.require) ? window.require('electron').remote : null
    if (!remote) return

    const win = remote.getCurrentWindow()
    win.close()
  }

  return (
    <div className="sys_bar">
      <div className="app_name">{title}</div>
      <div className="bar_actions">
        <div className="action_btn minimize" onClick={minimize}>
          <i className="material-icons">minimize</i>
        </div>
        <div className="action_btn full_toggle" onClick={fullToggle}>
          <i className="material-icons">{full ? 'crop_square' : 'filter_none'}</i>
        </div>
        <div className="action_btn close" onClick={close}>
          <i className="material-icons">close</i>
        </div>
      </div>
    </div>
  )
}

export default SysBar;
