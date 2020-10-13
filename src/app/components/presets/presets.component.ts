import { Color } from '../../types';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
    if (this.isColorAdded()) return;
    this.presetsChange.emit([...this.presets, this.color]);
  }

  onRemove(index: number) {
    const newPresets = [...this.presets];
    newPresets?.splice(index, 1);
    this.presetsChange.emit(newPresets ?? []);
  }

  onDrop(event: CdkDragDrop<Color[]>) {
    moveItemInArray(this.presets, event.previousIndex, event.currentIndex);
    this.presetsChange.emit(this.presets);
  }

  private isColorAdded() {
    const c = this.color;
    return this.presets.some(p => {
      return c.r === p.r && c.g === p.g && c.b === p.b;
    });
  }

}
