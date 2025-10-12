import { FormControl } from '@angular/forms';
import { IFormBuilderValueControl } from './external-value';
import { EFormBuilderControlType } from '@shared-components';

export interface IBuilderValueControlViewModel<TValue = any> extends IFormBuilderValueControl<TValue> {
  formControl: FormControl;
  type: EFormBuilderControlType;
  options?: { label: string; value: string }[];
}
