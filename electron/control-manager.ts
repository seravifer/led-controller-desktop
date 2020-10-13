import { ipcMain as events } from 'electron';
import { Device } from './devices/device.model';
import Flux from './devices/flux.device';
import Yeelight from './devices/yeelight.device';

export default function startDevicesManager(app: any) {

  const devices: Device[] = [];
  const protocolsSupported = [Flux, Yeelight];

  events.on('discover', async event => {
    console.log('Searching...');
    // @ts-ignore
    const discoveredDevices = (await Promise.all(protocolsSupported.map(p => p.discover()))).flat();
    console.log('Devices:', discoveredDevices);
    discoveredDevices.forEach(d => event.reply('new-device', d)); // TODO: send async events
    event.reply('new-device', null); // FIXME: add end event
  });

  events.handle('connect', async (_, device) => {
    console.log('Connecting...');
    const light = device.type === 'flux' ? new Flux() : new Yeelight(); // FIXME
    const state = await light.connect(device);
    console.log(`Connected to ${light.name}`);
    devices.push(light);
    return state;
  });

  events.on('disconnect', (_, device) => {
    devices.splice(devices.findIndex(d => d.id === device.id), 1);
    console.log('Device disconnected');
  });

  events.on('color', (_, device) => {
    console.log('Color', device);
    const light = devices.find(d => d.id === device.id);
    light?.setColor(device.state.color);
  });

  events.on('power', (_, device) => {
    console.log('Power', device);
    const light = devices.find(d => d.id === device.id);
    light?.setPower(device.state.power);
  });

  // TODO: update config device

  app.on('before-quit', () => {
    console.log('Leaving...');
    devices.forEach(d => {
      if (d.config.end) d.setPower(false);
    });
  });
}
