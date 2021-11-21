import { DeviceService } from './services/device.service';
import { StorageService } from './services/storage.service';
import { Device, State, Color } from './types';
import { Component, OnInit } from '@angular/core';
import { from, fromEvent, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public presets: Color[] = [];
  public devices: Device[] = [];
  public selectedDevice: Device | null = null;
  public deviceState: State = {
    power: false,
    color: { r: 255, g: 255, b: 255 }
  };
  public openSettings = false;

  constructor(
    private storage: StorageService,
    private device: DeviceService
  ) { }

  ngOnInit() {
    const savedDevices = this.storage.get<Device[]>('devices');
    this.presets = this.storage.get<Color[]>('presets') || [];
    if (!savedDevices) {
      this.saveState();
    } else {
      this.devices = savedDevices;
      this.selectedDevice = this.devices[0];
      this.connect();
    }
    this.listenFocusEvent();
  }

  private listenFocusEvent() {
    fromEvent(window, 'focus')
      .pipe(
        filter(() => this.selectedDevice != null),
        switchMap(() => from(this.device.getState(this.selectedDevice!)))
      )
      .subscribe(res => {
        this.deviceState = res;
        this.selectedDevice!.state = res;
      })
  }

  private connect() {
    if (!this.selectedDevice) return;
    this.device.connect(this.selectedDevice)
      .then(state => {
        this.deviceState = state;
        this.selectedDevice!.state = this.deviceState;
        console.log('Device selected:', this.selectedDevice);
        if (this.selectedDevice!.config.start) {
          this.selectedDevice!.state.power = true;
          this.onPowerChange();
        }
      });
  }

  onDevicesChange() {
    this.selectedDevice = this.devices[0];
    this.connect();
    this.saveState();
  }

  onColorChange() {
    if (!this.selectedDevice) return;
    this.device.changeColor(this.selectedDevice);
    this.deviceState.power = true;
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
