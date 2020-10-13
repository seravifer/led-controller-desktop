import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from './../types';
import { IpcRenderer } from 'electron';
import { IPC } from './electron.service';

@Injectable({ providedIn: 'root' })
export class DeviceService {

  constructor(
    @Inject(IPC) public ipcRenderer: IpcRenderer
  ) { }

  discover() {
    return new Observable<Device>(obs => {
      this.ipcRenderer.removeAllListeners('new-device');
      this.ipcRenderer.on('new-device', (_, device) => {
        if (device) obs.next(device);
        else obs.complete();
      });
      this.ipcRenderer.send('discover');
    });
  }

  connect(device: Device) {
    return this.ipcRenderer.invoke('connect', device);
  }

  changePower(device: Device) {
    this.ipcRenderer.send('power', device);
  }

  changeColor(device: Device) {
    this.ipcRenderer.send('color', device);
  }

}
