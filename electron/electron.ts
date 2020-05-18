import { app, BrowserWindow, ipcMain as events, Tray, Menu, screen } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import Devices from './devices';

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
      nodeIntegration: true,
      preload: path.resolve(__dirname, 'preload.js')
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

  win.on('close', (event) => {
    if (!app['isQuiting']) {
      event.preventDefault();
      win.hide();
    } else {
      tray.destroy();
    }
  });


  /**
   * App events
   */
  let deviceSelected;

  const devices = new Devices();

  events.on('discover', event => {
    console.log('discover')
    devices.on('new-device', (device) => {
      deviceSelected = device;
      event.reply('new-device', {
        power: deviceSelected.power,
        bright: deviceSelected.bright,
        color: deviceSelected.rgb
      });
    })
    devices.discover();
  });

  events.on('connect', async (event, id) => {
    deviceSelected = await devices.connectTo(id);
    await deviceSelected.updateState();
    event.returnValue = {
      power: deviceSelected.power,
      bright: deviceSelected.bright,
      color: deviceSelected.rgb
    };
  })

  events.on('change', (event, color) => {
    deviceSelected.setRGB([color.r, color.g, color.b]);
    console.log('RGB', color);
  });

  events.on('power', (event, power) => {
    deviceSelected.setPower(power);
    console.log('Power', power)
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
