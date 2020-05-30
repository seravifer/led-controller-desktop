import React from 'react';
import { ReactComponent as SettingsIcon } from './assets/settings.svg';
import ColorPicker from './components/ColorPicker/ColorPicker';
import Toggle from './components/Toggle/Toggle';
import Presets from './components/Presets/Presets';
import SettingsPage from './components/SettingsPage/SettingsPage';
import ipcRenderer  from './electron';
import './style.scss';

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
      localStorage.setItem('devices', JSON.stringify([]));
    } else {
      const devices = JSON.parse(savedDevices);
      this.setState({ devices, selectedDevice: devices[0] }, () => {
        ipcRenderer.invoke('connect', this.state.selectedDevice).then(state => {
          const selectedDevice = {...this.state.devices[0] };
          selectedDevice.state = state;
          this.setState({ selectedDevice })
          console.log('Device selected:', selectedDevice);
        });
      });
    }
  }

  onColorChange = (color) => {
    const selectedDevice = {...this.state.selectedDevice };
    selectedDevice.state.color = color.rgb;
    this.setState({ selectedDevice });
    ipcRenderer.send('color', selectedDevice);
  }

  onPowerChange = (power) => {
    const selectedDevice = {...this.state.selectedDevice };
    selectedDevice.state.power = power;
    this.setState({ selectedDevice });
    ipcRenderer.send('power', selectedDevice);
  }

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

  saveState() {
    localStorage.setItem('presets', JSON.stringify(this.state.presets));
  }

  render() {
    return (
      <div className="App">
        <SettingsPage open={this.state.open} devices={this.state.devices} />
        <header>
          <Toggle value={this.state.selectedDevice?.state?.power} onChange={(power) => this.onPowerChange(power)} />
          <SettingsIcon className={"settings-icon" + (this.state.open ? ' open' : '')} height="32px" fill="#d4d4d4" onClick={() => this.setState({ open: !this.state.open })}/>
        </header>
        <ColorPicker color={this.state.selectedDevice?.state?.color} onChange={(color) => this.onColorChange(color)} />
        <Presets
          color={this.state.selectedDevice?.state?.color}
          presets={this.state.presets}
          onSelectPreset={(color) => this.onSelectPreset(color)}
          onRemovePreset={(index) => this.onRemovePreset(index)}
          onAddPreset={this.onAddPreset} />
      </div>
    );
  }
}

export default App;
