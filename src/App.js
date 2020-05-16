import React from 'react';
// import { ipcRenderer }  from 'electron';
import ColorPicker from './ColorPicker/ColorPicker';
import Toggle from './Toggle/Toggle';
import Presets from './Presets/Presets';
import './style.css';

class App extends React.Component {

  state = {
    color: {
      r: 255,
      g: 255,
      b: 255
    },
    power: false
  }

  componentDidMount() {
    if (!window.localStorage.getItem('power')) {
      window.localStorage.setItem('power', this.state.power);
    } else {
      this.setState({ power: JSON.parse(window.localStorage.getItem('power')) });
    }
    if (!window.localStorage.getItem('color')) {
      window.localStorage.setItem('color', JSON.stringify(this.state.color))
    } else {
      this.setState({ color: JSON.parse(window.localStorage.getItem('color')) });
    }
    /*ipcRenderer.on('connected', () => {
      ipcRenderer.send('change-color', colorPicker.color.rgba);
    });*/
  }

  onColorChange(color) {
    this.setState({ color: color.rgb });
    // ipcRenderer.send('color', color.rgb);
    window.localStorage.setItem('color', JSON.stringify(color.rgb));

  }

  onPowerChange(power) {
    this.setState({ power: power });
    console.log(power)
    // ipcRenderer.send('power', switchButton.checked);
    window.localStorage.setItem('power', power);
  }

  render() {
    return (
      <div className="App">
        <Toggle value={this.state.power} onChange={(power) => this.onPowerChange(power) } />
        <ColorPicker color={this.state.color} onChange={(color) => this.onColorChange(color) } />
        <Presets />
      </div>
    );
  }
}

export default App;
