import React from 'react';
import './Presets.css';

class Presets extends React.Component {

  onAdd = () => {
    this.props.onAddPreset();
  }

  onSelect = (color) => {
    this.props.onSelectPreset(color)
  }

  onRemove = (index) => {
    this.props.onRemovePreset(index)
  }

  render() {
    return (
      <div className="presets">
        {this.props.presets.map((el, index) =>
          <div
            key={index}
            className="preset"
            onClick={() => this.onSelect(el)}
            onContextMenu={() => this.onRemove(index)}
            style={{ backgroundColor: `rgb(${el.r},${el.g},${el.b})` }} />
        )}
        { this.props.presets.length < 7 ? <div className="preset add" onClick={this.onAdd}></div> : null}
      </div>
    )
  }
}

export default Presets;
