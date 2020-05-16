const { app, BrowserWindow, ipcMain: events, Tray, Menu, screen } = require('electron');
const { Discovery, Control  } = require('magic-home');
const moment = require('moment');
const CronJob = require('cron').CronJob;

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

  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools({ mode: 'undocked' });

  const position = calculateWindowPosition();
  win.setBounds({
    x: position.x,
    y: position.y
  });

  const tray = new Tray("assets/icon.png");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
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

  /*win.webContents.on('did-finish-load', () => {
    let strip;

    let discovery = new Discovery();
    discovery.scan(500).then(async devices => {
        console.log(devices);
        strip = new Control("192.168.1.122");
        const state = await strip.queryState();
        console.log(state)
        events.emit('connected');
    });

    events.on('change', (event, color) => {
      if (strip) strip.setColorWithBrightness(color.r, color.g, color.b, color.a);
      console.log('RGBA', color);
    });

    events.on('power', (event, power) => {
      if (strip) strip.setPower(power);
      console.log('Power', power)
    })

    new CronJob('0 20-23 1/1 * *', () => {
      if (timeIsBetween('20:00', '23:00')) {
        console.log('Cron running!');
        win.webContents.send('turn-on');
      }
    }, null, true, 'Europe/Madrid', null, true);

    win.on('close', (event) => {
      if (!app.isQuiting) {
        event.preventDefault();
        win.hide();
      } else {
        tray.destroy();
        // JSON.stringify({ r: 0, g: 0, b: 0 });
      }
    });

  })*/
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

function timeIsBetween(min, max) {
  return moment().isBetween(moment(min, 'hh:mm'), moment(max, 'hh:mm'), 'm');
}
