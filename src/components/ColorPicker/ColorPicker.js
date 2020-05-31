import React from 'react';
import iro from '@jaames/iro';

class ColorPicker extends React.Component {

  options = {
    borderColor: '#ffffff',
    borderWidth: 2,
    layout: [
      {
        component: iro.ui.Wheel,
      },
      {
        component: iro.ui.Slider,
        options: { sliderType: 'value' }
      }
    ]
  }

  componentDidMount() {
    this.colorPicker = new iro.ColorPicker(this.el, this.options);
    this.colorPicker.on('input:change', (color) => {
      if (this.props.onChange) this.props.onChange(color);
    });
  }

  componentDidUpdate() {
    this.colorPicker.color.set(this.props.color || { r: 255, g: 255, b: 255 });
  }

  render() {
    return (
      <div ref={el => this.el = el} />
    );
  }
}

export default ColorPicker;
