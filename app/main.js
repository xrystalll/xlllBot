const path = require('path')
const config = require(path.join(__dirname, 'config', 'default.json'))
require(path.join(__dirname, 'server'))
const { app, BrowserWindow, Menu } = require('electron')

const createWindow = () => {
  let win = new BrowserWindow({
    title: 'xlllBot',
    backgroundColor: '#0e0e10',
    icon: path.join(__dirname, '..', 'build', 'images', 'icon.png'),
    width: 1150,
    height: 650,
    minWidth: 400,
    minHeight: 500,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: true,
    hasShadow: false,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: config.dev
    },
    nativeWindowOpen: true
  })

  Menu.setApplicationMenu(null)

  win.loadURL(config.clientEndPoint)

  config.dev && win.webContents.openDevTools()

  win.once('ready-to-show', () => {
    win.show()
  })

  win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    if (frameName !== 'Sign in via Twitch') {
      options.icon = path.join(__dirname, '..', 'build', 'images', 'icon.ico')
      options.modal = true
      options.parent = win
      options.frame = true
    }
  })

  win.on('closed', () => {
    win = null
  })
}

app.whenReady()
  .then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
