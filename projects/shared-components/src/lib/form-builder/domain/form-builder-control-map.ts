import { InputControlComponent } from '../controls/input/input-control.component';
import { TextareaControlComponent } from '../controls/textarea/textarea-control.component';
import { Type } from '@angular/core';
import { OutputsSelectControlComponent } from '../controls/outputs-select/outputs-select-control.component';
import { EFormBuilderControlType } from './e-form-builder-control-type';
import { IMap } from './i-map';
import { SelectControlComponent } from '../controls/select/select-control.component';
import { SelectDigitComponent } from '../controls/select-digit/select-digit.component';
import { RadioControlComponent } from '../controls/radio/radio-control.component';
import { DropdownControlComponent } from '../controls/dropdown/dropdown-control.component';
import { ConditionControlComponent } from '../controls/condition/condition-control.component';
import { TextboxControlComponent } from '../controls/textbox/textbox-control.component';
import { RepeaterControlComponent } from '../controls/repeater/repeater-control.component';
import { NumberControlComponent } from '../controls/number/number-control.component';

export const FORM_BUILDER_CONTROL_MAP: IMap<Type<any>> = {
  [EFormBuilderControlType.INPUT]: InputControlComponent,
  [EFormBuilderControlType.OUTPUTS_SELECT]: OutputsSelectControlComponent,
  [EFormBuilderControlType.TEXTAREA]: TextareaControlComponent,
  [EFormBuilderControlType.SELECT]: SelectControlComponent, // new mapping
  [EFormBuilderControlType.SELECT_DIGIT]: SelectDigitComponent, // added 
  [EFormBuilderControlType.RADIO]: RadioControlComponent,
  [EFormBuilderControlType.DROPDOWN]: DropdownControlComponent,   // ✅ ne ondition
  [EFormBuilderControlType.CONDITION]: ConditionControlComponent,
  [EFormBuilderControlType.TEXTBOX]: TextboxControlComponent, 
  [EFormBuilderControlType.REPEATER]: RepeaterControlComponent,
  [EFormBuilderControlType.NUMBER]: NumberControlComponent,
};
