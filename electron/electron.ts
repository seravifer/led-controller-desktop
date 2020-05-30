import { app, BrowserWindow, ipcMain as events, Tray, Menu, screen } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import { Discovery, Control } from 'magic-home';

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
  const devices: any[] = [];

  
  events.on('discover', event => {

    console.log('Searching...')
    let discovery = new Discovery();
    discovery.scan(500).then(devices => {
      console.log(devices)
      devices.forEach(device => {
        event.reply('new-device', {
          id: device.id,
          name: device.model,
          address: device.address
        });
      });
    });

  });

  events.handle('connect', async (event, device) => {
    console.log('Connecting...')
    let light = new Control(device.address, { wait_for_reply: false });
    const state = await light.queryState();
    console.log('Connected');
    devices.push({ ...device, controller: light });
    return {
      power: state.on,
      color: {
        r: state.color.red,
        g: state.color.green,
        b: state.color.blue,
      }
    };
  })

  events.on('color', (event, device) => {
    console.log('color', device)
    const light = devices.find(d => d.id === device.id);
    light.controller.setColor(device.state.color.r, device.state.color.g, device.state.color.b)
  });

  events.on('power', (event, device) => {
    console.log('power', device)
    const light = devices.find(d => d.id === device.id);
    light.controller.setPower(device.state.power);
  });

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
