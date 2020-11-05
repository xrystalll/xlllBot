const path = require('path')
const packager = require('electron-packager')
const options = {
  "arch": "ia32",
  "platform": "win32",
  "dir": "./",
  "icon": path.join(__dirname, '..', 'build', 'images', 'icon.ico'),
  "name": "xlllBot",
  "version": "1.0.0",
  "app-copyright": "xrystalll",
  "out": "./releases",
  "asar": true,
  "overwrite": true,
  "prune": true,
  "ignore": /(^\/(src|test|public|releases|\.[a-z]+|README|LICENSE|yarn|static|cache|preview|dist\/web))|\.gitkeep/,
}

async function bundleElectronApp(options) {
  const appPaths = await packager(options)
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`)
}

bundleElectronApp(options)
