const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 715,
    height: 830,
    webPreferences: {
      nodeIntegration: true
    },
    icon: 'assets/icons/logo-png.png',
  })

  // and load the index.html of the app.
  win.loadFile('./index.html')
}

app.whenReady().then(createWindow)
