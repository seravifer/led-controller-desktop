import { DeviceService } from './services/device.service';
import { StorageService } from './services/storage.service';
import { Device, State } from './types';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  presets = [];
  devices: Device[];
  selectedDevice: Device;
  deviceState: State = {
    power: false,
    color: { r: 255, g: 255, b: 255 }
  };
  openSettings = false;

  constructor(
    private storage: StorageService,
    private device: DeviceService
  ) {}

  ngOnInit() {
    const savedDevices = this.storage.get('devices');
    this.presets = this.storage.get('presets');
    if (!savedDevices) {
      this.saveState();
    } else {
      this.devices = savedDevices;
      this.selectedDevice =  this.devices[0];
      this.getDeviceState();
    }
  }

  getDeviceState() {
    if (!this.selectedDevice) return;
    this.device.connect(this.selectedDevice).then(state => {
      this.deviceState = state;
      this.selectedDevice.state = this.deviceState;
      console.log('Device selected:', this.selectedDevice);
      if (this.selectedDevice.config.start) {
        this.selectedDevice.state.power = true;
        this.onPowerChange();
      }
    });
  }

  onDevicesChange() {
    this.selectedDevice = this.devices[0];
    this.getDeviceState();
    this.saveState();
  }

  onColorChange() {
    if (!this.selectedDevice) return;
    this.device.changeColor(this.selectedDevice);
  }

  onPowerChange() {
    if (!this.selectedDevice) return;
    this.device.changePower(this.selectedDevice);
  }

  saveState() {
    this.storage.save('presets', this.presets ?? []);
    this.storage.save('devices', this.devices ?? []);
  }

}
