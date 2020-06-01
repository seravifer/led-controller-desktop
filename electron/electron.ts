import { app, BrowserWindow, ipcMain as events, Tray, Menu, screen } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import Flux from './flux.device.ts';
import { Device } from './device.model';

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

  win.loadURL(isDev ? 'http://localhost:3000/index.html' : path.join(__dirname, 'index.html'))
  if (isDev) win.webContents.openDevTools({ mode: 'undocked' });

  const position = calculateWindowPosition();
  win.setBounds({
    x: position.x,
    y: position.y
  });

  const iconPath = path.join(__dirname, 'icon-96x96.png');
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
  const devices: Device[] = [];

  events.on('discover', event => {
    console.log('Searching...')
    Flux.discover().then(devices => {
      console.log('Devices:', devices);
      devices.forEach(device => {
        event.reply('new-device', device);
      });
    });
  })

  events.handle('connect', async (event, device) => {
    console.log('Connecting...');
    let light = new Flux();
    const state = await light.connect(device);
    console.log(`Connected to ${light.name}`);
    devices.push(light);
    return state;
  })

  events.on('color', (event, device) => {
    console.log('color', device)
    const light = devices.find(d => d.id === device.id);
    light?.setColor(device.state.color);
  })

  events.on('power', (event, device) => {
    console.log('power', device)
    const light = devices.find(d => d.id === device.id);
    light?.setPower(device.state.power);
  })
  
  app.on("before-quit", (event) => {
    // devices[0].setPower(false);
    console.log('Leaving');
  });

}

const isAlreadyRunning = app.requestSingleInstanceLock();
if (!isAlreadyRunning) app.quit();

app.whenReady().then(createWindow);


/**
 * Helpers
 */

function calculateWindowPosition() {
  const screenSize = screen.getPrimaryDisplay().workArea;
  const x = screenSize.width - WIDTH;
  const y = screenSize.height - HEIGHT;
  return { x, y };
}
