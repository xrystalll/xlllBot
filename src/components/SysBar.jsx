import React, { useState, useEffect } from 'react';

const SysBar = ({ title = '' }) => {
  const [full, setFull] = useState(false)
  const remote = window.require ? window.require('electron').remote : null
  const win = !!remote ? remote.getCurrentWindow() : null

  useEffect(() => {
    window.addEventListener('resize', resizeHandler, false)

    return () => window.removeEventListener('resize', resizeHandler, false)
  })

  const resizeHandler = () => {
    if (!win) return

    setFull(win.isMaximized())
  }

  const minimize = () => {
    if (!win) return

    win.minimize()
  }

  const fullToggle = () => {
    if (!win) return

    if (win.isMaximized()) {
      win.restore()
    } else {
      win.maximize()
    }
  }

  const close = () => {
    if (!win) return

    win.close()
  }

  return (
    <div className="sys_bar">
      <div className="resize_zone x" />
      <div className="resize_zone y" />
      <div className="app_name">{title}</div>
      <div className="bar_actions">
        <div className="action_btn minimize" onClick={minimize}>
          <i className="material-icons">minimize</i>
        </div>
        <div className="action_btn full_toggle" onClick={fullToggle}>
          <i className="material-icons">{full ? 'filter_none' : 'crop_square'}</i>
        </div>
        <div className="action_btn close" onClick={close}>
          <i className="material-icons">close</i>
        </div>
      </div>
    </div>
  )
}

export default SysBar;
