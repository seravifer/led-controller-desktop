import { Color } from '../../types';
import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input,
  OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';
import iro from '@jaames/iro';

@Component({
  selector: 'color-picker',
  template: `<div #colorPickerEl></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements AfterViewInit, OnChanges {

  @ViewChild('colorPickerEl') colorPickerEl?: ElementRef<HTMLElement>;

  @Input() color?: Color;
  @Output() colorChange = new EventEmitter<Color>();

  private colorPicker: any;

  private OPTIONS = {
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
  };

  ngOnChanges(changes: SimpleChanges) {
    if (this.colorPicker && changes.color) {
      this.colorPicker.color.set(this.color || { r: 255, g: 255, b: 255 });
    }
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.colorPicker = new iro.ColorPicker(this.colorPickerEl.nativeElement, this.OPTIONS);
    this.colorPicker.color.set(this.color || { r: 255, g: 255, b: 255 });
    this.colorPicker.on('input:change', (color: any) => {
      // console.log(color.rgb);
      this.colorChange.emit(color.rgb);
    });
  }

}
