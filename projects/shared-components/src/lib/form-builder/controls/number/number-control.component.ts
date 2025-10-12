import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface NumberControlViewModel {
  name: string;
  formControl: FormControl;
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-number-control',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './number-control.component.html'
  // 👇 remove styleUrls if you don’t have an SCSS file
  // styleUrls: ['./number-control.component.scss']
})
export class NumberControlComponent {
  @Input() viewModel!: NumberControlViewModel;
}
