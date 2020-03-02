const { app, BrowserWindow, ipcMain, Tray, Menu, screen } = require('electron')
const SerialPort = require('serialport');

const port = new SerialPort('COM3', { baudRate: 9600 });

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
}

app.whenReady().then(createWindow);

port.on("open", () => {
  console.log('Open port!');
});

ipcMain.on('value', (event, rgb) => {
  console.log(rgb)
  port.write(JSON.stringify(rgb) + '\n');
});


function calculateWindowPosition() {
  const screenBounds = screen.getPrimaryDisplay().size;
  const x = screenBounds.width - WIDTH;
  const y = screenBounds.height - HEIGHT - 40; // Windows 10 taskbar size
  return { x, y };
}