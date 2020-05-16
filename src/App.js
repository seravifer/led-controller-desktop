import React from 'react';
// import { ipcRenderer }  from 'electron';
import ColorPicker from './ColorPicker/ColorPicker';
import Toggle from './Toggle/Toggle';
import Presets from './Presets/Presets';
import './style.css';

class App extends React.Component {

  state = {
    power: false,
    color: {
      r: 255,
      g: 255,
      b: 255
    },
    presets: []
  }

  componentDidMount() {
    this.recoverFromStorage('power');
    this.recoverFromStorage('color');
    this.recoverFromStorage('presets');
    /*ipcRenderer.on('connected', () => {
      ipcRenderer.send('change-color', colorPicker.color.rgba);
    });*/
  }

  recoverFromStorage = (item) => {
    if (!window.localStorage.getItem(item)) {
      window.localStorage.setItem(item, JSON.stringify(this.state[item]));
    } else {
      const newState = {};
      newState[item] = JSON.parse(window.localStorage.getItem(item));
      this.setState(newState);
    }
  }

  onColorChange = (color) => {
    this.setState({ color: color.rgb });
    // ipcRenderer.send('color', color.rgb);
    window.localStorage.setItem('color', JSON.stringify(color.rgb));

  }

  onPowerChange = (power) => {
    this.setState({ power });
    // ipcRenderer.send('power', switchButton.checked);
    window.localStorage.setItem('power', power);
  }

  onSelectPreset = (rgb) => {
    this.onColorChange({ rgb });
  }

  onAddPreset = () => {
    const { color, presets } = this.state;
    const exists = presets.some(el => el.r === color.r && el.g === color.g && el.b === color.b);
    if (exists) return;
    this.setState({ presets: [...presets, color] });
    window.localStorage.setItem('presets', JSON.stringify([...presets, color]));
  }

  onRemovePreset = (index) => {
    const { presets } = this.state;
    presets.splice(index, 1);
    this.setState({ presets })
    window.localStorage.setItem('presets', JSON.stringify(presets));
  }

  render() {
    return (
      <div className="App">
        <Toggle value={this.state.power} onChange={(power) => this.onPowerChange(power)} />
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
