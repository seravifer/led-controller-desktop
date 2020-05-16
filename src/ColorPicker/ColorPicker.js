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
      },
      /*{
        component: iro.ui.Slider,
        options: { sliderType: 'alpha' }
      }*/
    ]
  }

  componentDidMount() {
    this.colorPicker = new iro.ColorPicker(this.el, this.options);
    this.colorPicker.on('input:change', (color) => {
      if (this.props.onChange) this.props.onChange(color);
    });
  }

  componentDidUpdate() {
    const { color, ...colorPickerState } = this.props;
    if (color) this.colorPicker.color.set(color);
    this.colorPicker.setState(colorPickerState);
  }

  render() {
    return (
      <div ref={el => this.el = el} />
    );
  }
}

export default ColorPicker;
