const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 850,
    height: 740,
    webPreferences: {
      nodeIntegration: true
    },
    icon: 'assets/images/logo_square.png',
  })

  // and load the index.html of the app.
  win.loadFile('./index.html')
}

app.whenReady().then(createWindow)
