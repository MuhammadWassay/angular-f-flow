import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { IBuilderValueControlViewModel } from '../../domain/i-builder-value-control-view-model';

@Component({
  selector: 'select-digit-control',
  templateUrl: './select-digit.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption
  ]
})
export class SelectDigitComponent implements OnInit {

  @Input({ required: true })
  public viewModel!: IBuilderValueControlViewModel;

  public options: { label: string, value: number }[] = [];

  ngOnInit(): void {
    // Define digits 1 to 9
    this.options = Array.from({ length: 3 }, (_, i) => ({
      label: (i + 1).toString(),
      value: i + 1
    }));
  }
}
