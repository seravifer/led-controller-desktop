import { Color } from '../../types';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresetsComponent {

  @Input() presets: Color[] = [];
  @Output() presetsChange = new EventEmitter<Color[]>();

  @Input() color: Color;
  @Output() colorChange = new EventEmitter<Color>();

  onSelect(preset: Color) {
    this.colorChange.emit(preset);
  }

  onAdd() {
    this.presetsChange.emit([...this.presets, this.color]);
  }

  onRemove(index: number) {
    const newPresets = [...this.presets];
    newPresets?.splice(index, 1);
    this.presetsChange.emit(newPresets ?? []);
  }

}
