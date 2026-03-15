const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

// Permetti la riproduzione audio senza gesto utente (utile per i vocali)
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
// Evita blocchi del servizio audio in alcune configurazioni Linux
app.commandLine.appendSwitch('disable-features', 'AudioServiceSandbox');
// Evita crash GPU su alcune configurazioni Wayland/KDE
app.commandLine.appendSwitch('disable-gpu');
app.disableHardwareAcceleration();
// Forza X11 (alcuni ambienti Wayland/KDE fanno crashare Electron)
app.commandLine.appendSwitch('ozone-platform', 'x11');
app.commandLine.appendSwitch('ozone-platform-hint', 'x11');

app.whenReady().then(() => {
  try {
    mainWindow = new BrowserWindow({
      width: 900,
      height: 600,
      icon: path.join(__dirname, 'whatsapp.png'),
      title: "WhatsApp App",
      resizable: false,
      show: true,
      center: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });
  } catch (err) {
    console.error('[MAIN] BrowserWindow init failed:', err);
    return;
  }

  // WhatsApp Web blocca user agent "non Chrome": forza un UA recente
  const userAgent =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  mainWindow.webContents.setUserAgent(userAgent);

  // Imposta i dettagli app solo su Windows
  if (process.platform === 'win32' && typeof app.setAppDetails === 'function') {
    app.setAppDetails({
      appId: 'whatsapp-app',
      appName: 'WhatsApp App'
    });
  }

  mainWindow.once('ready-to-show', () => {
    console.log('[MAIN] ready-to-show');
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    console.log('[MAIN] window closed');
  });

  mainWindow.loadURL('https://web.whatsapp.com');
  mainWindow.setMenuBarVisibility(false);

});

app.on('window-all-closed', () => {
  console.log('[MAIN] window-all-closed');
  if (process.platform !== 'darwin') app.quit();
});

app.on('child-process-gone', (_event, details) => {
  console.log('[MAIN] child-process-gone', details);
});
