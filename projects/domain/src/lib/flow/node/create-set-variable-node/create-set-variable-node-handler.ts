import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateSetVariableNodeRequest } from './create-set-variable-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { generateGuid } from '@foblex/utils';
import { IHandler } from '@foblex/mediator';

@Injectable({
  providedIn: 'root'
})
export class CreateSetVariableNodeHandler implements IHandler<CreateSetVariableNodeRequest, INodeModel> {

  public handle(request: CreateSetVariableNodeRequest): INodeModel {

    return {
      key: generateGuid(),
      description: 'Set Variable Node',
      input: generateGuid() + '_input',
      outputs: [
        { key: generateGuid(), name: 'set variable out' }
      ],
      position: request.position,
      type: ENodeType.SetVariable,
      value: {
        groups: [
          {
            param: 'variable_selection',
            name: 'Select Variable',
            controls: [
              {
                key: 'variable',
                name: 'Variable',
                type: EFormBuilderControlType.SELECT,
                value: 'user_input',
                options: [
                  { label: 'User Input', value: 'user_input' },
                  { label: 'Caller Number', value: 'caller_number' },
                  { label: 'System Time', value: 'system_time' }
                ]
              }
            ]
          },
          {
            param: 'operator_selection',
            name: 'Select Operator',
            controls: [
              {
                key: 'operator',
                name: 'Operator',
                type: EFormBuilderControlType.SELECT,
                value: '=',
                options: [
                  { label: 'Equals (=)', value: '=' },
                ]
              }
            ]
          },
          {
            param: 'value_selection',
            name: 'Select Value or Textbox',
            controls: [
              {
                key: 'value',
                name: 'Value',
                type: EFormBuilderControlType.SELECT,
                value: 'user_input',
                options: [
                  { label: 'User Input', value: 'user_input' },
                  { label: 'Caller Number', value: 'caller_number' },
                  { label: 'System Time', value: 'system_time' },
                  { label: 'Textbox', value: 'textbox' }
                ]
              },
              {
                key: 'customValue',
                name: 'Custom Textbox Value',
                type: EFormBuilderControlType.TEXTBOX,
                value: ''
              }
            ]
          }
        ]
      }
    };
  }
}
