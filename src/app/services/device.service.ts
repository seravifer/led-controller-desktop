import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from './../types';
import { IPC, IpcRenderer } from './electron.service';

@Injectable({ providedIn: 'root' })
export class DeviceService {

  constructor(
    @Inject(IPC) private ipcRenderer: IpcRenderer
  ) { }

  public discover() {
    return new Observable<Device>(obs => {
      const subscription = this.ipcRenderer.on('new-device', (device) => {
        if (device) obs.next(device);
        else {
          subscription();
          obs.complete();
        }
      })
      this.ipcRenderer.send('discover');
    });
  }

  public connect(device: Device) {
    return this.ipcRenderer.invoke('connect', device);
  }

  public changePower(device: Device) {
    this.ipcRenderer.send('power', device);
  }

  public changeColor(device: Device) {
    this.ipcRenderer.send('color', device);
  }

}
