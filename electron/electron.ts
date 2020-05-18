import { app, BrowserWindow, ipcMain as events, Tray, Menu, screen } from 'electron';
import { Discovery, Control } from 'magic-home';
import * as isDev from 'electron-is-dev';
import * as path from 'path';

const WIDTH = 364;
const HEIGHT = 560;

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

  win.loadURL(isDev ? 'http://localhost:3000/index.html' : path.join(__dirname, '..', 'index.html'))
  if (isDev) win.webContents.openDevTools({ mode: 'undocked' });

  const position = calculateWindowPosition();
  win.setBounds({
    x: position.x,
    y: position.y
  });
  
  const iconPath = path.join(__dirname, '..', 'icon-96x96.png');
  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app['isQuiting'] = true;
        app.quit();
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.on("click", () => win.show());

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
    let device;

    events.on('discover', () => {
      const discovery = new Discovery();
      discovery.scan(500).then(devices => {
        events.emit('discover', devices);
        console.log(devices);
      });
    });

    events.on('connect', async (device: any) => {
      device = new Control(device.address);
      const state = await device.queryState();
      events.emit('connect', state);
    })

    events.on('change', (event, color) => {
      device.setColorWithBrightness(color.r, color.g, color.b, color.a);
      console.log('RGBA', color);
    });

    events.on('power', (event, power) => {
      device.setPower(power);
      console.log('Power', power)
    })

    win.on('close', (event) => {
      if (!app['isQuiting']) {
        event.preventDefault();
        win.hide();
      } else {
        tray.destroy();
      }
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
