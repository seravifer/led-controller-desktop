import React from 'react';
import { ReactComponent as SettingsIcon } from './assets/settings.svg';
import ColorPicker from './components/ColorPicker/ColorPicker';
import Toggle from './components/Toggle/Toggle';
import Presets from './components/Presets/Presets';
import SettingsPage from './components/SettingsPage/SettingsPage';
import ipcRenderer from './electron';

class App extends React.Component {

  state = {
    selectedDevice: null,
    devices: [],
    presets: [],
    open: false
  }

  componentDidMount() {
    const savedDevices = localStorage.getItem('devices');
    this.setState({ presets: JSON.parse(localStorage.getItem('presets')) || [] })
    if (!savedDevices) {
      this.saveState();
    } else {
      const devices = JSON.parse(savedDevices);
      this.setState({ devices, selectedDevice: devices[0] }, () => {
        this.getDeviceState();
      });
    }
  }

  getDeviceState() {
    if (!this.state.selectedDevice) return;
    ipcRenderer.invoke('connect', this.state.selectedDevice).then(state => {
      const selectedDevice = { ...this.state.devices[0] };
      selectedDevice.state = state;
      this.setState({ selectedDevice });
      console.log('Device selected:', selectedDevice);
      if (this.state.selectedDevice.config.start) this.onPowerChange(true);
    });
  }

  /**
   * Devices
   */

  onAddDevice(device) {
    let selectedDevice = this.state.selectedDevice;
    if (!selectedDevice) {
      selectedDevice = device;
    }
    this.setState({ devices: [...this.state.devices, device], selectedDevice }, () => {
      this.saveState();
      this.getDeviceState();
    });
  }

  onRemoveDevice(device) {
    let selectedDevice = this.state.selectedDevice;
    if (device.id === selectedDevice.id) {
      selectedDevice = null;
    }
    const devices = this.state.devices;
    devices.splice(devices.find(d => d.id === device.id), 1);
    this.setState({ devices, selectedDevice }, () => {
      this.saveState();
    })
  }

  onChangeConfig(device, config) {
    const devices = [...this.state.devices];
    const deviceByID = devices.find(d => d.id === device.id);
    deviceByID.config = { ...deviceByID.config, ...config };
    this.setState({ devices }, () => this.saveState());
  }

  saveState() {
    localStorage.setItem('presets', JSON.stringify(this.state.presets));
    localStorage.setItem('devices', JSON.stringify(this.state.devices));
  }

  /**
   * State
   */

  onColorChange = (color) => {
    const selectedDevice = { ...this.state.selectedDevice };
    selectedDevice.state.color = color.rgb;
    this.setState({ selectedDevice });
    ipcRenderer.send('color', selectedDevice);
  }

  onPowerChange = (power) => {
    const selectedDevice = { ...this.state.selectedDevice };
    selectedDevice.state.power = power;
    this.setState({ selectedDevice });
    ipcRenderer.send('power', selectedDevice);
  }

  /**
   * Presets
   */

  onSelectPreset = (rgb) => {
    this.onColorChange({ rgb });
  }

  onAddPreset = () => {
    const { color } = this.state.selectedDevice.state;
    const exists = this.state.presets.some(el => el.r === color.r && el.g === color.g && el.b === color.b);
    if (exists) return;
    this.setState({ presets: [...this.state.presets, color] }, this.saveState);
  }

  onRemovePreset = (index) => {
    const { presets } = this.state;
    presets.splice(index, 1);
    this.setState({ presets }, this.saveState);
  }


  render() {
    return (
      <>
        <SettingsPage
          open={this.state.open}
          devices={this.state.devices}
          onAddDevice={(d) => this.onAddDevice(d)}
          onRemoveDevice={(d) => this.onRemoveDevice(d)}
          onChangeConfig={(d, c) => this.onChangeConfig(d, c)}
        />
        <header>
          <Toggle value={this.state.selectedDevice?.state?.power} onChange={(s) => this.onPowerChange(s)} disabled={!this.state.selectedDevice} />
          <SettingsIcon className={"settings-icon" + (this.state.open ? ' open' : '')} height="32px" onClick={() => this.setState({ open: !this.state.open })} />
        </header>
        <ColorPicker color={this.state.selectedDevice} onChange={(c) => this.onColorChange(c)} />
        <Presets
          color={this.state.selectedDevice?.state?.color}
          presets={this.state.presets}
          onSelectPreset={(c) => this.onSelectPreset(c)}
          onRemovePreset={(i) => this.onRemovePreset(i)}
          onAddPreset={this.onAddPreset} />
      </>
    );
  }
}

export default App;
