import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { IBuilderValueControlViewModel } from '../../domain/i-builder-value-control-view-model';

@Component({
  selector: 'radio-control',
  templateUrl: './radio-control.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,       // Needed for *ngIf and *ngFor
    ReactiveFormsModule,
    MatRadioModule
  ]
})
export class RadioControlComponent {
  @Input({ required: true })
  public viewModel!: IBuilderValueControlViewModel;

  get control(): FormControl {
    return this.viewModel.formControl as FormControl;
  }
}
