import React from 'react';
import { ReactComponent as RemoveIcon } from "./remove.svg";
import './SettingsPage.scss';

class SettingsPage extends React.Component {

  render() {
    return (
      <div className={'settings-page' + (this.props.open ? ' open' : '')}>
        <div className="settings-wrapper">
          <h1>Devices</h1>
          <div className="list-devices">
            <div className="device"><RemoveIcon className="remove-icon" /><span>Device #1</span></div>
          </div>
        </div>
      </div>
    )
  }
}

export default SettingsPage;
