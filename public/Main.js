const {app, BrowserWindow} = require('electron')
const path = require('path')


function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600, icon: __dirname + '/icon.png'})

    // and load the app.
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
}

app.on('ready', createWindow)