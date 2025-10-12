import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';   // 👈 operator dropdown ke liye
import { IBuilderValueControlViewModel } from '../../domain/i-builder-value-control-view-model';

@Component({
  selector: 'condition-control',
  templateUrl: './condition-control.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,   // 👈 yeh add karo
    MatInputModule,       // 👈 input fields ke liye
    MatSelectModule       // 👈 dropdown ke liye
  ]
})
export class ConditionControlComponent {
  @Input({ required: true })
  public viewModel!: IBuilderValueControlViewModel;
}
