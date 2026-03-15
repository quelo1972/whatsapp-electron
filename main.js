const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    icon: path.join(__dirname, 'whatsapp.png'), // icona PNG nella stessa cartella
    title: "WhatsApp App",
    resizable: true,
    webPreferences: {
      nodeIntegration: false
    }
  });

  mainWindow.loadURL('https://web.whatsapp.com');
  mainWindow.setMenuBarVisibility(false);
});