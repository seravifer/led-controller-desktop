import {ipcMain as events } from 'electron';
import Flux from './flux.device.ts';
import { Device } from './device.model';

export default function startDevicesManager(app) {
  const devices: Device[] = [];

  events.on('discover', event => {
    console.log('Searching...')
    Flux.discover().then(devices => {
      console.log('Devices:', devices);
      devices.forEach(device => {
        event.reply('new-device', device);
      })
    })
  })

  events.handle('connect', async (e, device) => {
    console.log('Connecting...');
    let light = new Flux();
    const state = await light.connect(device);
    console.log(`Connected to ${light.name}`);
    devices.push(light);
    return state;
  })

  events.on('disconnect', (e, device) => {
    devices.splice(devices.findIndex(d => d.id === device.id), 1);
    console.log('Device disconnected')
  })

  events.on('color', (e, device) => {
    console.log('Color', device)
    const light = devices.find(d => d.id === device.id);
    light?.setColor(device.state.color);
  })

  events.on('power', (e, device) => {
    console.log('Power', device)
    const light = devices.find(d => d.id === device.id);
    light?.setPower(device.state.power);
  })
  
  app.on("before-quit", (e) => {
    devices.forEach(d => {
      if (d.config.end) d.setPower(false)
    })
    console.log('Leaving...');
  })
}
