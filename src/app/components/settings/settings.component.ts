import { Device } from './../../types';
import { DeviceService } from './../../services/device.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @Input() open = false;
  @Input() devices: Device[] = [];
  @Output() devicesChange = new EventEmitter<Device[]>();

  searchDevices: Device[] = [];
  searching = false;

  constructor(private device: DeviceService) {}

  onSearch() {
    this.searching = true;
    this.device.discover().subscribe({
      next: (device) => {
        if (this.searchDevices.some((d) => d.id === device.id)) return;
        if (this.devices.some((d) => d.id === device.id)) return;
        this.searchDevices.push(device);
      },
      complete: () => (this.searching = false)
    });
  }

  onAdd(device: Device) {
    device.config = {
      start: false,
      end: false
    };
    const findDevice = this.searchDevices.findIndex((d) => d.id === device.id);
    this.searchDevices.splice(findDevice, 1);
    this.devices.push(device);
    this.devicesChange.emit(this.devices);
  }

  onChangeConfig(device: Device, event: any) {
    device.config[event.target.name] = event.target.checked;
    this.devicesChange.emit(this.devices);
  }

  onRemove(device: Device) {
    const findDevice = this.devices.findIndex((d) => d.id === device.id);
    this.devices.splice(findDevice, 1);
    this.devicesChange.emit(this.devices);
  }

  trackBy(index: number, device: Device) {
    return device.id;
  }
}
