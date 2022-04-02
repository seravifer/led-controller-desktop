import { ipcMain as events } from 'electron';
import { Device } from './devices/device.model';
import Flux from './devices/flux.device';

export default function startDevicesManager() {
  const devices: Device[] = [];

  events.on('discover', async (event) => {
    console.log('Searching...');
    const discoveredDevices = await Flux.discover();
    console.log('Devices:', discoveredDevices);
    discoveredDevices.forEach((d) => event.reply('new-device', d));
  });

  events.handle('connect', async (_, device) => {
    console.log('Connecting...');
    const light = new Flux();
    const state = await light.connect(device);
    console.log(`Connected to ${light.name}`);
    devices.push(light);
    return state;
  });

  events.handle('state', async (_, device) => {
    const light = devices.find((d) => d.id === device.id);
    const state = await light?.getState();
    return state;
  });

  events.on('disconnect', (_, device) => {
    devices.splice(
      devices.findIndex((d) => d.id === device.id),
      1
    );
    console.log('Device disconnected');
  });

  events.on('color', (_, device) => {
    console.log('Color', device);
    const light = devices.find((d) => d.id === device.id);
    light?.setColor(device.state.color);
  });

  events.on('power', (_, device) => {
    console.log('Power', device);
    const light = devices.find((d) => d.id === device.id);
    light?.setPower(device.state.power);
  });
}
