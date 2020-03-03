const { app, BrowserWindow, ipcMain: events, Tray, Menu, screen } = require('electron')
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')

const WIDTH = 364;
const HEIGHT = 500;

function createWindow() {
  const win = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    show: false,
    alwaysOnTop: true,
    fullscreenable: false,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/index.html');
  win.webContents.openDevTools({ mode: 'undocked' });

  const position = calculateWindowPosition();
  win.setBounds({
    x: position.x,
    y: position.y
  });

  const tray = new Tray("assets/icon.png");
  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.on("click", () => {
    win.show();
  });

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    } else {
      tray.destroy();
      port.write(JSON.stringify({ r: 0, g: 0, b: 0 }) + '\n');
    }
  });

  win.on("blur", () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide();
    }
  });

  win.on('minimize', (event) => {
    event.preventDefault();
    win.hide();
  });

  win.webContents.on('did-finish-load', () => {
    const port = new SerialPort('COM3', { baudRate: 19200 });
    const parser = port.pipe(new Readline({ delimiter: '\n' }))
    let portIsOpen = false;

    port.on("open", async () => {
      await sleep(2000); // Wait to Arduino start
      portIsOpen = true;
      win.webContents.send('open-port');
      console.log('Open port!');
    });
    
    port.on("close", () => {
      portIsOpen = false;
      win.webContents.send('close-port');
      console.log('Open port!');
    });

    parser.on('data', console.log)
    
    events.on('value', (event, rgb) => {
      if (!portIsOpen) return;
      console.log(rgb);
      port.write(JSON.stringify(rgb) + '\n');
    });
  })
}

app.whenReady().then(createWindow);


/**
 * Helpers
 */

function calculateWindowPosition() {
  const screenBounds = screen.getPrimaryDisplay().size;
  const x = screenBounds.width - WIDTH;
  const y = screenBounds.height - HEIGHT - 40; // Windows 10 taskbar size
  return { x, y };
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}