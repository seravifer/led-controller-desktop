import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'toggle',
  template: `
    <input id="switch" class="tgl tgl-skewed" type="checkbox" [checked]="value" (change)="onChange($event)" />
    <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="switch"></label>
  `,
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent {

  @Input() value = false;
  @Output() valueChange = new EventEmitter<boolean>();

  @Input()
  @HostBinding('class.disabled')
  disabled = false;

  onChange(event: any) {
    this.valueChange.emit(event.target.checked);
  }

}
