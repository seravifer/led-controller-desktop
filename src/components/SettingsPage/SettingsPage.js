import React from 'react';
import { ReactComponent as RemoveIcon } from "./remove.svg";
import { ReactComponent as AddIcon } from "./add.svg";
import ipcRenderer  from '../../electron';
import './SettingsPage.scss';

class SettingsPage extends React.Component {

  state = {
    searchDevices: [],
    devices: []
  }

  componentDidMount() {
    const devices = localStorage.getItem('devices');
    if (!devices) {
      localStorage.setItem('devices', JSON.stringify([]));
    } else {
      this.setState(JSON.parse(devices));
    }
  }

  search = () => {
    ipcRenderer.removeAllListeners('new-device');
    ipcRenderer.on('new-device', (event, device) => {
      console.log(device);
      if (this.state.searchDevices.find(d => d.id === device.id)) return;
      this.setState({ searchDevices: [...this.state.searchDevices, device] })
    });
    ipcRenderer.send('discover');
  }

  connect(device) {
    ipcRenderer.invoke('connect', device).then(state => {
      console.log(state)
      localStorage.setItem('devices', JSON.stringify([...this.state.devices, device]));
      this.setState({ devices: [...this.state.devices, device] })
    })
  }

  remove(device) {
    const devices = [...this.state.devices];
    devices.splice(devices.find(d => d.id === device.id), 1);
    localStorage.setItem('devices', this.state.devices);
  }

  render() {
    return (
      <div className={'settings-page' + (this.props.open ? ' open' : '')}>
        <div className="settings-wrapper">
          <h1>Devices</h1>
          <div className="list-devices">
            {this.state.searchDevices.map(d =>
              <div className="device" key={d.id}><AddIcon className="add-icon" onClick={() => this.connect(d)}/><span>{d.name}</span></div>
            )}
          </div>
          <button onClick={this.search}>Search</button>
          <div className="list-devices">
            {this.state.devices.map(d =>
              <div className="device" key={d.id}><RemoveIcon className="add-icon" onClick={() => this.remove(d)}/><span>{d.name}</span></div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default SettingsPage;
