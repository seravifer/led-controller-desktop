import React from 'react';
import './Toggle.scss';

class Toggle extends React.Component {
  render() {
    return (
      <div className={this.props.disabled ? 'disabled' : null}>
        <input id="switch" className="tgl tgl-skewed" type="checkbox" checked={this.props.value || false} onChange={(event) => this.props.onChange(event.target.checked)} />
        <label className="tgl-btn" data-tg-off="OFF" data-tg-on="ON" htmlFor="switch"></label>
      </div>
    );
  }
}

export default Toggle;
