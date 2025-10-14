import { Injectable } from '@angular/core';
import { IHandler } from '@foblex/mediator';
import { INodeModel, ENodeType } from '../../index';
import { CreateDBStoreNodeRequest } from './create-db-store-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { generateGuid } from '@foblex/utils';

@Injectable({
  providedIn: 'root'
})
export class CreateDBStoreNodeHandler implements IHandler<CreateDBStoreNodeRequest, INodeModel> {

  public handle(request: CreateDBStoreNodeRequest): INodeModel {
    const node: INodeModel = {
      key: generateGuid(),
      description: 'DB Store Node',
      input: generateGuid() + '_input',
      outputs: [
        { key: generateGuid(), name: 'db store out' }
      ],
      position: request.position,
      type: ENodeType.DBStore,
      value: {
        groups: [
          {
            name: 'Condition',
            controls: [
              {
                key: 'variable',
                name: 'Variable',
                type: EFormBuilderControlType.DROPDOWN,
                value: 'user_input',
                options: [
                  { label: 'User Input', value: 'user_input' }
                ]
              },
              {
                key: 'operator',
                name: 'Operator',
                type: EFormBuilderControlType.DROPDOWN,
                value: '=',
                options: [
                  { label: 'Equals (=)', value: '=' }
                ]
              },
              {
                key: 'value',
                name: 'Value',
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
