import React from 'react';
// import { ipcRenderer }  from 'electron';
import ColorPicker from './ColorPicker/ColorPicker';
import { ReactComponent as SettingsIcon } from './settings.svg';
import Toggle from './Toggle/Toggle';
import Presets from './Presets/Presets';
import SettingsPage from './SettingsPage/SettingsPage';
import './style.css';

class App extends React.Component {

  state = {
    power: false,
    color: {
      r: 255,
      g: 255,
      b: 255
    },
    presets: [],
    open: false
  }

  componentDidMount() {
    const state = localStorage.getItem('state');
    if (!state) {
      localStorage.setItem('state', JSON.stringify(this.state));
    } else {
      this.setState(JSON.parse(state));
    }
    /*ipcRenderer.on('connected', () => {
      ipcRenderer.send('change-color', colorPicker.color.rgba);
    });*/
  }

  saveState() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  onColorChange = (color) => {
    this.setState({ color: color.rgb }, this.saveState);
    // ipcRenderer.send('color', color.rgb);
  }

  onPowerChange = (power) => {
    this.setState({ power }, this.saveState);
    // ipcRenderer.send('power', switchButton.checked);
  }

  onSelectPreset = (rgb) => {
    this.onColorChange({ rgb });
  }

  onAddPreset = () => {
    const { color, presets } = this.state;
    const exists = presets.some(el => el.r === color.r && el.g === color.g && el.b === color.b);
    if (exists) return;
    this.setState({ presets: [...presets, color] }, this.saveState);
  }

  onRemovePreset = (index) => {
    const { presets } = this.state;
    presets.splice(index, 1);
    this.setState({ presets }, this.saveState);
  }

  render() {
    return (
      <div className="App">
        <SettingsPage open={this.state.open}/>
        <header>
          <Toggle value={this.state.power} onChange={(power) => this.onPowerChange(power)} />
          <SettingsIcon className={"settings-icon" + (this.state.open ? ' open' : '')} height="32px" fill="#d4d4d4" onClick={() => this.setState({ open: !this.state.open })}/>
        </header>
        <ColorPicker color={this.state.color} onChange={(color) => this.onColorChange(color)} />
        <Presets
          color={this.state.color}
          presets={this.state.presets}
          onSelectPreset={(color) => this.onSelectPreset(color)}
          onRemovePreset={(index) => this.onRemovePreset(index)}
          onAddPreset={this.onAddPreset} />
      </div>
    );
  }
}

export default App;
