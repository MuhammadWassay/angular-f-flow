import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreatePlayFileNodeRequest } from './create-play-file-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { generateGuid } from '@foblex/utils';
import { IHandler } from '@foblex/mediator';
import { DropdownService } from './dropdown.service'; // Assuming this service is intended for other purposes or future use, as it's not directly used for setting options here.

@Injectable({
  providedIn: 'root'
})
export class CreatePlayFileNodeHandler implements IHandler<CreatePlayFileNodeRequest, INodeModel> {

  constructor(private dropdownService: DropdownService) { }

  public handle(request: CreatePlayFileNodeRequest): INodeModel {
    const node: INodeModel = {
      key: generateGuid(),
      description: 'Play File Node',
      input: generateGuid() + '_input',
     outputs: [
  {
    key: generateGuid() + '_output',
    name: 'play_file',
  }
],

      position: request.position,
      type: ENodeType.PlayFile,
      value: {
        groups: [
          {
            name: 'Select File',
            controls: [
              {
                key: 'file',
                name: 'File',
                type: EFormBuilderControlType.SELECT,
                value: 'a',
                options: [
                  { label: 'A', value: 'a' },
                  { label: 'B', value: 'b' },
                  { label: 'C', value: 'c' }
                ]
              }



            ]
          }
        ]
      }
    };

    // --- Start Debugging Logs ---
    console.log('1. Node created (before options set):', JSON.parse(JSON.stringify(node)));
    // --- End Debugging Logs ---

    // Type assertion to access the 'options' property, as INodeControl might not directly have it
    const fileControl = node.value!.groups[0].controls[0] as {
      key: string;
      name: string;
      type: EFormBuilderControlType;
      value: string;
      options?: { label: string; value: string }[]; // Ensure 'options' is explicitly defined here
    };

    fileControl.options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
    ];

    // --- Start Debugging Logs ---
    console.log('2. File control options set to:', fileControl.options);
    console.log('3. Complete node (after options set):', JSON.parse(JSON.stringify(node)));
    // --- End Debugging Logs ---

    return node;
  }
}

// this.dropdownService.getOptions().then((opts: { label: string; value: string }[]) => {
//   (node.value!.groups[0].controls[0] as any).options = opts;
// });
