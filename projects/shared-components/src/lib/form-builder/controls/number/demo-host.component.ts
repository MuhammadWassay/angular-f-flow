import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NumberControlViewModel } from './number-control.component';

@Component({
  selector: 'app-demo-host',
  template: `
    <app-number-control [viewModel]="numberVm"></app-number-control>
  `
})
export class DemoHostComponent {
  numberVm: NumberControlViewModel = {
    name: 'Retry Trials',
    formControl: new FormControl(3), // ✅ must be FormControl
    min: 1,
    max: 9
  };
}
