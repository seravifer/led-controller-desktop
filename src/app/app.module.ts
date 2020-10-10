import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { PresetsComponent } from './components/presets/presets.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ToggleComponent } from './components/toggle/toggle.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    ColorPickerComponent,
    PresetsComponent,
    SettingsComponent,
    ToggleComponent
  ],
  imports: [
    BrowserModule
  ]
})
export class AppModule { }
