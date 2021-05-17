import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device, State } from './../types';
import { IPC, IpcInterface } from './electron.service';

@Injectable({ providedIn: 'root' })
export class DeviceService {

  constructor(
    @Inject(IPC) private ipc: IpcInterface
  ) { }

  public discover() {
    return new Observable<Device>(obs => {
      const subscription = this.ipc.on<Device>('new-device', (device) => {
        if (device) obs.next(device);
        else {
          subscription();
          obs.complete();
        }
      });
      this.ipc.send('discover');
    });
  }

  public getState(device: Device) {
    return this.ipc.invoke<State>('state', device);
  }

  public connect(device: Device) {
    return this.ipc.invoke<State>('connect', device);
  }

  public changePower(device: Device) {
    this.ipc.send('power', device);
  }

  public changeColor(device: Device) {
    this.ipc.send('color', device);
  }

}
