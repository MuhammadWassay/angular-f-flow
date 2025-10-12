import { Injectable } from '@angular/core';
import { IHandler } from '@foblex/mediator';
import { INodeModel, ENodeType } from '../../index';
import { CreateIfElseNodeRequest } from './create-if-else-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { generateGuid } from '@foblex/utils';

@Injectable({
  providedIn: 'root'
})
export class CreateIfElseNodeHandler implements IHandler<CreateIfElseNodeRequest, INodeModel> {

  public handle(request: CreateIfElseNodeRequest): INodeModel {
    const node: INodeModel = {
      key: generateGuid(),
      description: 'If/Else Node',
      input: generateGuid() + '_input',
      outputs: [
        { key: generateGuid(), name: 'True' },
        { key: generateGuid(), name: 'False' }
      ],
      position: request.position,
      type: ENodeType.IfElse,
      value: {
        groups: [
          {
            name: 'Condition',
            controls: [
              {
                key: 'leftValue',
                name: 'Left Value',
                type: EFormBuilderControlType.TEXTBOX,
                value: ''
              },
              {
                key: 'operator',
                name: 'Operator',
                type: EFormBuilderControlType.DROPDOWN,
                value: '==',
                options: [
                  { label: 'Equals (==)', value: '==' },
                  { label: 'Not Equals (!=)', value: '!=' },
                  { label: 'Greater Than (>)', value: '>' },
                  { label: 'Less Than (<)', value: '<' },
                  { label: '>=', value: '>=' },
                  { label: '<=', value: '<=' }
                ]
              },
              {
                key: 'rightValue',
                name: 'Right Value',
                type: EFormBuilderControlType.TEXTBOX,
                value: ''
              }
            ]
          }
        ]
      }
    };

    return node;
  }
}
