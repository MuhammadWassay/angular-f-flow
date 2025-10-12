import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBuilderValueControlViewModel } from '../../domain/i-builder-value-control-view-model';

@Component({
  selector: 'repeater-control',
  templateUrl: './repeater-control.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RepeaterControlComponent {
  @Input({ required: true })
  public viewModel!: IBuilderValueControlViewModel;

  addCondition() {
    const current = this.viewModel.formControl.value || [];
    current.push({ leftValue: '', operator: '==', rightValue: '' });
    this.viewModel.formControl.setValue(current);
  }

  removeCondition(index: number) {
    const current = this.viewModel.formControl.value || [];
    current.splice(index, 1);
    this.viewModel.formControl.setValue(current);
  }
}
