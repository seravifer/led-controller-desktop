import { app, BrowserWindow, Tray, Menu, screen } from 'electron';
import ShutdownHandler from '@paymoapp/electron-shutdown-handler';
import startDevicesManager from './manager';
import { ipcMain as events } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';

const WIDTH = 364;
const HEIGHT = 560;

function createWindow() {
  const win = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreenable: false,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js')
    }
  });

  win.loadURL(isDev ? 'http://localhost:4200' : path.resolve(__dirname, 'index.html'));
  if (isDev) win.webContents.openDevTools({ mode: 'undocked' });

  ShutdownHandler.setWindowHandle(win.getNativeWindowHandle());
  ShutdownHandler.blockShutdown('Turning off leds...');

  const position = calculateWindowPosition();
  win.setBounds({
    x: position.x,
    y: position.y
  });

  const iconPath = path.resolve(__dirname, 'assets', 'icon-96x96.png');
  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => win.show()
    },
    {
      label: 'Exit',
      click: () => {
        app['isQuiting'] = true;
        app.quit();
        ShutdownHandler.releaseShutdown();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => win.show());

  win.on('blur', () => {
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

  ShutdownHandler.on('shutdown', () => {
    win.webContents.send('shutdown');
    events.on('shutdown', () => {
      ShutdownHandler.releaseShutdown();
      app['isQuiting'] = true;
      app.quit();
    });
  });

  startDevicesManager();
}

const isAlreadyRunning = app.requestSingleInstanceLock();
if (!isAlreadyRunning) app.quit();

app.whenReady().then(createWindow);

/**
 * Helpers
 */

function calculateWindowPosition() {
  // TODO: support other postions and OS
  const screenSize = screen.getPrimaryDisplay().workArea;
  const x = screenSize.width - WIDTH;
  const y = screenSize.height - HEIGHT;
  return { x, y };
}
