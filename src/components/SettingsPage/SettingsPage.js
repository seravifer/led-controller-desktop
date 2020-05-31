import React from 'react';
import { ReactComponent as RemoveIcon } from "./remove.svg";
import { ReactComponent as AddIcon } from "./add.svg";
import ipcRenderer  from '../../electron';
import './SettingsPage.scss';

class SettingsPage extends React.Component {

  state = {
    searchDevices: [],
    searching: false
  }

  search() {
    this.setState({ searching: true });
    ipcRenderer.removeAllListeners('new-device');
    ipcRenderer.on('new-device', (event, device) => {
      console.log(device);
      if (this.state.searchDevices.find(d => d.id === device.id)) return;
      this.setState({ searchDevices: [...this.state.searchDevices, device] });
      this.setState({ searching: false });
    });
    ipcRenderer.send('discover');
  }

  add(device) {
    this.props.onAddDevice(device);
    const searchDevices = this.state.searchDevices;
    searchDevices.splice(searchDevices.find(d => d.id === device.id), 1);
    this.setState({ searchDevices });
  }

  remove(device) {
    this.props.onRemoveDevice(device);
  }

  render() {
    return (
      <div className={'settings-page' + (this.props.open ? ' open' : '')}>
        <div className="settings-wrapper">
          <h1>Devices</h1>
          <div className="list-devices">
            {this.props.devices.map(d =>
              <div className="device" key={d.id}><RemoveIcon className="action-icon" onClick={() => this.remove(d)}/><span>{d.name}</span></div>
            )}
          </div>
          <hr />
          <h2>Search</h2>
          <div className="list-devices">
            {this.state.searchDevices.map(d =>
              <div className="device" key={d.id}><AddIcon className="action-icon" onClick={() => this.add(d)}/><span>{d.name}</span></div>
            )}
            {this.state.searching ? 'Searching...' : null}
          </div>
         {!this.state.searching ? <button onClick={() => this.search()}>Search</button> : null}
        </div>
      </div>
    )
  }
}

export default SettingsPage;
