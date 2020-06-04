import React from 'react';
import { ReactComponent as RemoveIcon } from "./remove.svg";
import { ReactComponent as AddIcon } from "./add.svg";
import { ReactComponent as LedIcon } from "./led.svg";
import ipcRenderer from '../../electron';
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
      this.setState({ searching: false });
      if (this.state.searchDevices.find(d => d.id === device.id) || this.props.devices.find(d => d.id === device.id)) return;
      this.setState({ searchDevices: [...this.state.searchDevices, device] });
    });
    ipcRenderer.send('discover');
  }

  add(device) {
    device.config = {
      start: false,
      end: false
    };
    this.props.onAddDevice(device);
    const searchDevices = this.state.searchDevices;
    searchDevices.splice(searchDevices.find(d => d.id === device.id), 1);
    this.setState({ searchDevices });
  }

  changeConfig(device, event) {
    const config = {};
    config[event.target.name] = event.target.checked;
    this.props.onChangeConfig(device, config)
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
              <details className="device" key={d.id}>
                <summary>
                  <LedIcon className="icon" />
                  <div className="device-info">
                    <div className="title">{d.name}<RemoveIcon className="remove-icon" onClick={() => this.remove(d)} /></div>
                    <div className="model">{d.type}</div>
                  </div>
                </summary>
                <div className="content">
                  <div className="checkbox">
                    <input type="checkbox" id="start" name="start" defaultChecked={d.config.start} onChange={(e) => this.changeConfig(d, e)} />
                    <label htmlFor="start">Turn ON on Start Up</label>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" id="end" name="end" />
                    <label htmlFor="end">Turn OFF on Shut Down</label>
                  </div>
                </div>
              </details>
            )}
          </div>
          <hr />
          <h2>Search</h2>
          <div className="list-devices">
            {this.state.searchDevices.map(d =>
              <details className="device not-open" key={d.id}>
                <summary>
                  <LedIcon className="icon" />
                  <div className="device-info">
                    <div className="title">{d.name}<AddIcon className="remove-icon" onClick={() => this.add(d)} /></div>
                    <div className="model">{d.type}</div>
                  </div>
                </summary>
              </details>
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
